import type { LocaleContent } from "./en.ts";

export const es: LocaleContent = {
  labels: {
    valuation: "Valoración",
    name: "Nombre",
    year: "Año",
    region: "País/Región",
    denomination: "Denominación",
    mintage: "Ceca",
    krauseNumber: "Número Krause",
    material: "Material",
    diameter: "Diámetro",
    thickness: "Grosor",
    weight: "Peso",
    obverse: "Anverso",
    reverse: "Reverso",
    details: "Detalles",
    collectionAdvice: "Consejo de Colección",
    lettering: "Leyenda",
    description: "Descripción",
    creators: "Diseñadores",
  },
  messages: {
    recognitionResult: "Resultado del Reconocimiento",
    uploading: "Subiendo archivos al servidor...",
    recognitionFailed: "Reconocimiento fallido",
    notCoin: "No reconocido como moneda, puede ser otro objeto",
    error: "Error",
    needTwoImages: "Sube 2 imágenes de la misma moneda.",
    needOneMoreImage: "Sube 1 imagen más de la misma moneda.",
    tooManyImages: "Vuelve a subirlas. Solo se permiten 2 imágenes por solicitud.",
    collectionAdviceWithValuation: "La valoración actual es de aproximadamente {valuation}; prioriza preservar el estado de la moneda y luego verifica la marca de ceca, la variante y los detalles de conservación para afinar la tasación.",
    collectionAdviceForCoinWithValuation: "Para {coin}, la valoración actual es de aproximadamente {valuation}; prioriza preservar el estado de la moneda y luego verifica la marca de ceca, la variante y los detalles de conservación para afinar la tasación.",
    collectionAdviceForCoin: "Para {coin}, preserva primero el estado de la moneda y luego verifica la marca de ceca, la variante y los detalles de conservación antes de decidir una colección a largo plazo.",
    collectionAdviceDefault: "Prioriza preservar primero el estado de la moneda y luego revisa la variante y la marca de ceca antes de decidir una colección a largo plazo.",
  },
  prompts: {
    recognizeUsage:
      "Uso: node recognize.ts <img1> <img2> [--locale <locale>] [--token <token>]",
    resolveRequestUsage: "Uso: node resolve-request.ts [session-file]",
    missingFiles: "Por favor proporcione ambos archivos de imagen",
  },
};
