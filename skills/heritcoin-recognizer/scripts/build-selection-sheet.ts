import { createHash } from "crypto";
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { extname, join } from "path";
import {
  getSelectionDir,
  getSelectionKey,
  labelForIndex,
  writeSelectionManifest,
} from "./selection-state.ts";
import type { SelectionCandidate } from "./selection-state.ts";

const MIME_BY_EXTENSION: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

function isDataUrl(value: string): boolean {
  return /^data:image\/[a-zA-Z0-9.+-]+;base64,/i.test(value);
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function guessMimeType(value: string, fallback: string = "image/jpeg"): string {
  return MIME_BY_EXTENSION[extname(value).toLowerCase()] || fallback;
}

async function toRenderableDataUrl(input: string): Promise<string> {
  if (isDataUrl(input)) {
    return input;
  }

  if (isHttpUrl(input)) {
    const response = await fetch(input);
    if (!response.ok) {
      throw new Error(`下载候选图失败: ${input}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const mimeType = response.headers.get("content-type") || guessMimeType(input);
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    return `data:${mimeType};base64,${base64}`;
  }

  const buffer = readFileSync(input);
  const mimeType = guessMimeType(input);
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}

function getColumnCount(count: number): number {
  if (count <= 2) {
    return count;
  }
  if (count <= 4) {
    return 2;
  }
  return 3;
}

function buildSvg(candidates: Array<SelectionCandidate & { render_url: string }>): string {
  const columns = getColumnCount(candidates.length);
  const rows = Math.ceil(candidates.length / columns);
  const pagePadding = 28;
  const cardWidth = 320;
  const cardHeight = 372;
  const imageWidth = 272;
  const imageHeight = 272;
  const gap = 20;
  const width = pagePadding * 2 + columns * cardWidth + (columns - 1) * gap;
  const height = pagePadding * 2 + rows * cardHeight + (rows - 1) * gap;

  const cards = candidates
    .map((candidate, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      const x = pagePadding + column * (cardWidth + gap);
      const y = pagePadding + row * (cardHeight + gap);
      const imageX = x + 24;
      const imageY = y + 60;

      return `
  <g>
    <rect x="${x}" y="${y}" width="${cardWidth}" height="${cardHeight}" rx="24" fill="#fffdf8" stroke="#d9d1bf" stroke-width="2" />
    <rect x="${x + 24}" y="${y + 18}" width="54" height="30" rx="15" fill="#1e3a2f" />
    <text x="${x + 51}" y="${y + 39}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="18" font-weight="700" fill="#f8f4ea">${candidate.id}</text>
    <rect x="${imageX}" y="${imageY}" width="${imageWidth}" height="${imageHeight}" rx="18" fill="#f3ecdc" />
    <image x="${imageX}" y="${imageY}" width="${imageWidth}" height="${imageHeight}" preserveAspectRatio="xMidYMid meet" href="${candidate.render_url}" />
    <text x="${x + cardWidth / 2}" y="${y + 354}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="18" fill="#3a342d">回复 ${candidate.id}</text>
  </g>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#efe6d5" />
${cards}
</svg>`;
}

function getOutputPaths(inputs: string[], persist: boolean): { key: string; svgPath: string } {
  const key = getSelectionKey();
  const digest = createHash("sha1").update(inputs.join("\n")).digest("hex").slice(0, 10);
  const fileName = persist ? "selection-sheet.svg" : `selection-sheet-${digest}.svg`;
  return {
    key,
    svgPath: join(getSelectionDir(key), fileName),
  };
}

async function main() {
  const args = process.argv.slice(2);
  const persist = args.includes("--persist");
  const labelsIndex = args.indexOf("--labels");
  const labelArg =
    labelsIndex >= 0 && labelsIndex + 1 < args.length ? args[labelsIndex + 1] : "";
  const customLabels = labelArg
    ? labelArg
        .split(",")
        .map((label) => label.trim().toUpperCase())
        .filter(Boolean)
    : [];
  const inputs = args.filter((arg, index) => {
    if (arg === "--persist" || arg === "--labels") {
      return false;
    }
    if (labelsIndex >= 0 && index === labelsIndex + 1) {
      return false;
    }
    return true;
  });

  if (inputs.length === 0) {
    throw new Error(
      "用法: node build-selection-sheet.ts [--persist] [--labels A,B] <img1> [img2...]",
    );
  }

  if (customLabels.length > 0 && customLabels.length !== inputs.length) {
    throw new Error("自定义标签数量必须与图片数量一致。");
  }

  const candidates: Array<SelectionCandidate & { render_url: string }> = [];
  for (let index = 0; index < inputs.length; index += 1) {
    const source = inputs[index];
    candidates.push({
      id: customLabels[index] || labelForIndex(index),
      source,
      render_url: await toRenderableDataUrl(source),
    });
  }

  const { key, svgPath } = getOutputPaths(inputs, persist);
  mkdirSync(getSelectionDir(key), { recursive: true });
  const svg = buildSvg(candidates);
  writeFileSync(svgPath, svg, "utf8");

  if (persist) {
    writeSelectionManifest({
      key,
      created_at: new Date().toISOString(),
      selection_sheet: svgPath,
      candidates: candidates.map(({ id, source }) => ({ id, source })),
    });
  }

  console.log(
    JSON.stringify(
      {
        selection_key: key,
        selection_sheet: svgPath,
        candidates: candidates.map(({ id, source }) => ({ id, source })),
        persisted: persist,
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
