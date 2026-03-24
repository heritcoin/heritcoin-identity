export const en = {
  labels: {
    valuation: "Valuation",
    name: "Name",
    year: "Year",
    region: "Country/Region",
    denomination: "Denomination",
    mintage: "Mintage",
    krauseNumber: "Krause Number",
    material: "Material",
    diameter: "Diameter",
    thickness: "Thickness",
    weight: "Weight",
    obverse: "Obverse",
    reverse: "Reverse",
    details: "Details",
    collectionAdvice: "Collection Advice",
  },
  messages: {
    recognitionResult: "Recognition Result",
    uploading: "Uploading files to server...",
    uploadComplete: "File upload complete",
    recognitionFailed: "Recognition failed",
    notCoin: "Not recognized as a coin, may be other object",
    error: "Error",
    collectionAdviceWithValuation: "Use the current valuation as a quick reference, and prioritize preserving the coin's condition before making any long-term collecting decision.",
    collectionAdviceDefault: "Prioritize preserving the coin's condition first, then review the variety and mint mark before deciding on long-term collecting.",
  },
  prompts: {
    usage: "Usage: node recognize.ts <img1> <img2> [token] [locale]",
    missingFiles: "Please provide both image files",
  },
};

export type LocaleContent = typeof en;
