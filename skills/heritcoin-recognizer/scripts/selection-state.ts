import { createHash } from "crypto";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

export interface SelectionCandidate {
  id: string;
  source: string;
}

export interface SelectionManifest {
  key: string;
  created_at: string;
  selection_sheet: string;
  candidates: SelectionCandidate[];
}

function getStateSeed(): string {
  return process.env.CODEX_THREAD_ID || process.cwd();
}

export function getSelectionKey(): string {
  return createHash("sha1").update(getStateSeed()).digest("hex").slice(0, 12);
}

export function getSelectionDir(key: string = getSelectionKey()): string {
  return join(tmpdir(), "heritcoin-selection-state", key);
}

export function getSelectionManifestPath(key: string = getSelectionKey()): string {
  return join(getSelectionDir(key), "selection-manifest.json");
}

export function labelForIndex(index: number): string {
  let value = index + 1;
  let label = "";

  while (value > 0) {
    value -= 1;
    label = String.fromCharCode(65 + (value % 26)) + label;
    value = Math.floor(value / 26);
  }

  return label;
}

export function writeSelectionManifest(manifest: SelectionManifest): void {
  mkdirSync(getSelectionDir(manifest.key), { recursive: true });
  writeFileSync(
    getSelectionManifestPath(manifest.key),
    JSON.stringify(manifest, null, 2),
    "utf8",
  );
}

export function readSelectionManifest(key: string = getSelectionKey()): SelectionManifest {
  const manifestPath = getSelectionManifestPath(key);
  if (!existsSync(manifestPath)) {
    throw new Error("未找到待选择的候选图片。请先让用户重新发送候选图。");
  }

  return JSON.parse(readFileSync(manifestPath, "utf8")) as SelectionManifest;
}

export function clearSelectionManifest(key: string = getSelectionKey()): void {
  const manifestPath = getSelectionManifestPath(key);
  if (existsSync(manifestPath)) {
    rmSync(manifestPath, { force: true });
  }
}
