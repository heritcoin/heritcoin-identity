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
  },
  messages: {
    recognitionResult: "Resultado del Reconocimiento",
    uploading: "Subiendo archivos al servidor...",
    uploadComplete: "Carga de archivos completada",
    recognitionFailed: "Reconocimiento fallido",
    notCoin: "No reconocido como moneda, puede ser otro objeto",
    error: "Error",
    collectionAdviceWithValuation: "Usa la valoración actual como referencia rápida y prioriza preservar el estado de la moneda antes de decidir si la conservarás a largo plazo.",
    collectionAdviceDefault: "Prioriza preservar primero el estado de la moneda y luego revisa la variante y la marca de ceca antes de decidir una colección a largo plazo.",
  },
  prompts: {
    usage: "Uso: node recognize.ts <img1> <img2> [token] [locale]",
    missingFiles: "Por favor proporcione ambos archivos de imagen",
  },
};
