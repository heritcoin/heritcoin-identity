import {
  clearSelectionManifest,
  readSelectionManifest,
} from "./selection-state.ts";

function parseLabels(input: string, knownIds: string[]): string[] {
  const uppercaseInput = input.toUpperCase();
  const directMatches = uppercaseInput.match(/[A-Z]+/g) || [];
  const hasMultiLetterIds = knownIds.some((id) => id.length > 1);

  if (directMatches.length === 1 && !hasMultiLetterIds && directMatches[0].length > 1) {
    return directMatches[0].split("");
  }

  return directMatches;
}

async function main() {
  const selectionText = process.argv.slice(2).join(" ").trim();
  if (!selectionText) {
    throw new Error('用法: node resolve-selection.ts "A+B"');
  }

  const manifest = readSelectionManifest();
  const labels = parseLabels(
    selectionText,
    manifest.candidates.map((candidate) => candidate.id),
  );
  const uniqueLabels = [...new Set(labels)];

  if (uniqueLabels.length !== 2) {
    throw new Error("请选择且只选择 2 张图，例如 A+B。");
  }

  const selected = uniqueLabels.map((label) => {
    const match = manifest.candidates.find((candidate) => candidate.id === label);
    if (!match) {
      throw new Error(`未找到标签 ${label} 对应的候选图。`);
    }
    return match;
  });

  clearSelectionManifest();

  console.log(
    JSON.stringify(
      {
        selection_key: manifest.key,
        selection_sheet: manifest.selection_sheet,
        selected,
        images: selected.map((candidate) => candidate.source),
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
