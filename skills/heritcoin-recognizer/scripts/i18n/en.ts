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
    lettering: "Lettering",
    description: "Description",
    creators: "Creators",
  },
  messages: {
    recognitionResult: "Recognition Result",
    uploading: "Uploading files to server...",
    recognitionFailed: "Recognition failed",
    notCoin: "Not recognized as a coin, may be other object",
    error: "Error",
    needTwoImages: "Please upload 2 images of the same coin.",
    needOneMoreImage: "Please upload 1 more image of the same coin.",
    tooManyImages: "Please re-upload. Only 2 images are allowed per request.",
    collectionAdviceWithValuation: "The current valuation is about {valuation}; prioritize preserving the coin's condition, then verify the mint mark, variety, and condition details for a tighter appraisal.",
    collectionAdviceForCoinWithValuation: "For {coin}, the current valuation is about {valuation}; prioritize preserving the coin's condition, then verify the mint mark, variety, and condition details for a tighter appraisal.",
    collectionAdviceForCoin: "For {coin}, preserve the coin's condition first, then verify the mint mark, variety, and condition details before deciding on long-term collecting.",
    collectionAdviceDefault: "Prioritize preserving the coin's condition first, then review the variety and mint mark before deciding on long-term collecting.",
  },
  prompts: {
    recognizeUsage:
      "Usage: node recognize.ts <img1> <img2> [--locale <locale>] [--token <token>]",
    resolveRequestUsage: "Usage: node resolve-request.ts [session-file]",
    missingFiles: "Please provide both image files",
  },
};

export type LocaleContent = typeof en;
