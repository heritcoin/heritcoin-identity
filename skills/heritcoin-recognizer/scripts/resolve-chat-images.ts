import { createHash } from "crypto";
import {
  createReadStream,
  mkdirSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "fs";
import { homedir, tmpdir } from "os";
import { join } from "path";
import readline from "readline";

type ImageRef =
  | { kind: "data_url"; value: string }
  | { kind: "http_url"; value: string }
  | { kind: "local_path"; value: string };

interface MessageRecord {
  role: "user" | "assistant";
  phase?: string;
  text: string;
  images: ImageRef[];
  explicitTextImages: ImageRef[];
}

const RECOGNITION_INTENT =
  /(这是什么币|帮我识别|识别一下|值多少钱|什么币|coin|identify|appraise|estimate)/i;
const IMAGE_FOLLOW_UP =
  /(还差|缺|补充|补发|再上传|再发|另一张|第二张|other side|another image|one more image|second image)/i;
const IMAGE_HINT =
  /(图|图片|照片|附件|image|images|photo|photos)/i;
const EXPLICIT_IMAGE_SUPPLEMENT_CUE =
  /(补第.?二张|第二张|补图|另一张|另一面|反面|正面|同一枚|还是这枚|same coin|same one|other side|second image|another image|obverse|reverse)/i;
const IMAGE_URL_IN_TEXT = /https?:\/\/[^\s"'`<>()\]]+/gi;
const LOCAL_IMAGE_PATH_IN_TEXT =
  /(?:^|[\s(])((?:\/|~\/)[^\s"'`<>()]+?\.(?:jpe?g|png|gif|webp|bmp|heic|heif))(?:$|[\s)])/gi;
const IMAGE_FILE_EXTENSION =
  /\.(?:jpe?g|png|gif|webp|bmp|heic|heif)(?:[?#][^\s"'`<>()\]]*)?$/i;
const HERITCOIN_IMAGE_URL =
  /cdn\.heritcoin\.com\/sky\/identify\/|\/recognise\/image\/|\/identify\/(?:original\/)?image\//i;

function getCodexHome(): string {
  return process.env.CODEX_HOME || join(homedir(), ".codex");
}

function findLatestSessionFile(rootDir: string): string {
  const matches: Array<{ path: string; mtimeMs: number }> = [];

  function walk(directory: string) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const fullPath = join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }
      if (!entry.isFile() || !entry.name.startsWith("rollout-") || !entry.name.endsWith(".jsonl")) {
        continue;
      }
      matches.push({ path: fullPath, mtimeMs: statSync(fullPath).mtimeMs });
    }
  }

  walk(rootDir);
  if (matches.length === 0) {
    throw new Error(`未找到 session 日志: ${rootDir}`);
  }

  matches.sort((left, right) => right.mtimeMs - left.mtimeMs);
  return matches[0].path;
}

function findSessionFileByThreadId(rootDir: string, threadId: string): string | null {
  function walk(directory: string): string | null {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const fullPath = join(directory, entry.name);
      if (entry.isDirectory()) {
        const nestedMatch = walk(fullPath);
        if (nestedMatch) {
          return nestedMatch;
        }
        continue;
      }
      if (
        entry.isFile() &&
        entry.name.startsWith("rollout-") &&
        entry.name.endsWith(".jsonl") &&
        entry.name.includes(threadId)
      ) {
        return fullPath;
      }
    }
    return null;
  }

  return walk(rootDir);
}

function classifyImageRef(value: string): ImageRef {
  if (/^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(value)) {
    return { kind: "data_url", value };
  }
  if (/^https?:\/\//.test(value)) {
    return { kind: "http_url", value };
  }
  return { kind: "local_path", value };
}

function getImageRefKey(image: ImageRef): string {
  return `${image.kind}:${image.value}`;
}

function mergeImageRefs(...groups: ImageRef[][]): ImageRef[] {
  const merged: ImageRef[] = [];
  const seen = new Set<string>();

  for (const group of groups) {
    for (const image of group) {
      const key = getImageRefKey(image);
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      merged.push(image);
    }
  }

  return merged;
}

function normalizeUrlCandidate(value: string): string {
  return value.replace(/[),.;!?]+$/g, "");
}

function looksLikeImageUrl(value: string): boolean {
  return IMAGE_FILE_EXTENSION.test(value) || HERITCOIN_IMAGE_URL.test(value);
}

function extractExplicitImageRefsFromText(text: string): ImageRef[] {
  const refs: ImageRef[] = [];
  const seen = new Set<string>();

  for (const match of text.matchAll(IMAGE_URL_IN_TEXT)) {
    const candidate = normalizeUrlCandidate(match[0]);
    if (!looksLikeImageUrl(candidate) || seen.has(candidate)) {
      continue;
    }
    seen.add(candidate);
    refs.push(classifyImageRef(candidate));
  }

  for (const match of text.matchAll(LOCAL_IMAGE_PATH_IN_TEXT)) {
    const candidate = match[1];
    if (!candidate || seen.has(candidate)) {
      continue;
    }
    seen.add(candidate);
    refs.push({ kind: "local_path", value: candidate });
  }

  return refs;
}

function stripExplicitImageRefsFromText(text: string): string {
  return text
    .replace(IMAGE_URL_IN_TEXT, " ")
    .replace(LOCAL_IMAGE_PATH_IN_TEXT, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractMessage(entry: unknown): MessageRecord | null {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const record = entry as {
    type?: string;
    payload?: {
      type?: string;
      role?: string;
      phase?: string;
      content?: Array<Record<string, unknown>>;
    };
  };

  if (
    record.type !== "response_item" ||
    record.payload?.type !== "message" ||
    (record.payload.role !== "user" && record.payload.role !== "assistant") ||
    !Array.isArray(record.payload.content)
  ) {
    return null;
  }

  const textParts: string[] = [];
  const images: ImageRef[] = [];
  const role = record.payload.role;

  for (const item of record.payload.content) {
    if (role === "user") {
      if (item.type === "input_text" && typeof item.text === "string") {
        textParts.push(item.text);
        continue;
      }
      if (item.type === "input_image" && typeof item.image_url === "string") {
        images.push(classifyImageRef(item.image_url));
        continue;
      }
      if (item.type === "local_image" && typeof item.path === "string") {
        images.push({ kind: "local_path", value: item.path });
      }
      continue;
    }

    if (item.type === "output_text" && typeof item.text === "string") {
      textParts.push(item.text);
    }
  }

  const text = textParts.join("");
  const explicitTextImages =
    role === "user" ? extractExplicitImageRefsFromText(text) : [];

  return {
    role,
    phase: typeof record.payload.phase === "string" ? record.payload.phase : undefined,
    text,
    images,
    explicitTextImages,
  };
}

async function loadMessages(sessionFile: string): Promise<MessageRecord[]> {
  const messages: MessageRecord[] = [];
  const reader = readline.createInterface({
    input: createReadStream(sessionFile, { encoding: "utf8" }),
    crlfDelay: Infinity,
  });

  for await (const line of reader) {
    if (!line.trim()) {
      continue;
    }
    try {
      const parsed = JSON.parse(line);
      const message = extractMessage(parsed);
      if (message) {
        messages.push(message);
      }
    } catch {
      continue;
    }
  }

  return messages;
}

function isFinalAssistantMessage(message: MessageRecord): boolean {
  return message.role === "assistant" && message.phase !== "commentary";
}

function assistantKeepsTaskOpen(text: string): boolean {
  return IMAGE_FOLLOW_UP.test(text) && IMAGE_HINT.test(text);
}

function getMessageImages(message: MessageRecord): ImageRef[] {
  return mergeImageRefs(message.images, message.explicitTextImages);
}

function hasSupplementalImageCue(message: MessageRecord): boolean {
  const cueText = stripExplicitImageRefsFromText(message.text);
  return EXPLICIT_IMAGE_SUPPLEMENT_CUE.test(cueText);
}

function resolveLatestTaskImages(messages: MessageRecord[]): ImageRef[] {
  let currentTaskImages: ImageRef[] = [];
  let assistantRequestedMoreImages = false;
  let previousUserMessageHadImages = false;

  for (const message of messages) {
    if (message.role === "user") {
      const messageImages = getMessageImages(message);
      const mergeRequestedByAssistant = assistantRequestedMoreImages;
      assistantRequestedMoreImages = false;

      if (messageImages.length > 0) {
        const shouldMergeIntoOpenTask =
          currentTaskImages.length > 0 &&
          (
            previousUserMessageHadImages ||
            mergeRequestedByAssistant ||
            hasSupplementalImageCue(message)
          );

        currentTaskImages = shouldMergeIntoOpenTask
          ? mergeImageRefs(currentTaskImages, messageImages)
          : messageImages;
        previousUserMessageHadImages = true;
        continue;
      }

      previousUserMessageHadImages = false;

      if (RECOGNITION_INTENT.test(message.text)) {
        continue;
      }

      currentTaskImages = [];
      assistantRequestedMoreImages = false;
      continue;
    }

    if (currentTaskImages.length === 0 || !isFinalAssistantMessage(message)) {
      continue;
    }

    previousUserMessageHadImages = false;

    if (assistantKeepsTaskOpen(message.text)) {
      assistantRequestedMoreImages = true;
      continue;
    }

    if (!assistantKeepsTaskOpen(message.text)) {
      currentTaskImages = [];
      assistantRequestedMoreImages = false;
    }
  }

  return currentTaskImages;
}

function getFileExtensionFromMimeType(mimeType: string): string {
  const mapping: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
  };
  return mapping[mimeType] || "jpg";
}

function materializeDataUrl(dataUrl: string, outputDir: string, index: number): string {
  const match = dataUrl.match(
    /^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=\s]+)$/,
  );
  if (!match) {
    throw new Error("无法解析聊天附件数据 URL");
  }

  const [, mimeType, base64Content] = match;
  const extension = getFileExtensionFromMimeType(mimeType);
  const hash = createHash("sha1").update(dataUrl).digest("hex").slice(0, 12);
  const filePath = join(outputDir, `chat-image-${index + 1}-${hash}.${extension}`);

  writeFileSync(filePath, Buffer.from(base64Content.replace(/\s+/g, ""), "base64"));
  return filePath;
}

function materializeImages(images: ImageRef[], sessionFile: string): string[] {
  const sessionHash = createHash("sha1").update(sessionFile).digest("hex").slice(0, 12);
  const outputDir = join(tmpdir(), "heritcoin-chat-images", sessionHash);
  mkdirSync(outputDir, { recursive: true });

  return images.map((image, index) => {
    if (image.kind === "data_url") {
      return materializeDataUrl(image.value, outputDir, index);
    }
    return image.value;
  });
}

async function main() {
  const sessionsRoot = join(getCodexHome(), "sessions");
  const sessionFileArg = process.argv[2];
  const threadSessionFile = process.env.CODEX_THREAD_ID
    ? findSessionFileByThreadId(sessionsRoot, process.env.CODEX_THREAD_ID)
    : null;
  const sessionFile = sessionFileArg || threadSessionFile || findLatestSessionFile(sessionsRoot);
  const messages = await loadMessages(sessionFile);
  const taskImages = resolveLatestTaskImages(messages);
  const images = materializeImages(taskImages, sessionFile);

  console.log(
    JSON.stringify(
      {
        session_file: sessionFile,
        task_image_count: images.length,
        images,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(
    JSON.stringify(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      null,
      2,
    ),
  );
  process.exit(1);
});
