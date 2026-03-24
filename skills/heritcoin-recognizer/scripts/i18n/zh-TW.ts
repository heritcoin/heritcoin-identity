import type { LocaleContent } from "./en.ts";

export const zhTW: LocaleContent = {
  labels: {
    valuation: "估價",
    name: "名稱",
    year: "年份",
    region: "國家/地區",
    denomination: "面值",
    mintage: "鑄造量",
    krauseNumber: "Krause編號",
    material: "材質",
    diameter: "直徑",
    thickness: "厚度",
    weight: "重量",
    obverse: "正面",
    reverse: "背面",
    details: "詳細資訊",
    collectionAdvice: "收藏建議",
  },
  messages: {
    recognitionResult: "識別結果",
    uploading: "正在上傳檔案到伺服器...",
    uploadComplete: "檔案上傳完成",
    recognitionFailed: "識別失敗",
    notCoin: "未識別為硬幣，可能是其他物品",
    error: "錯誤",
    collectionAdviceWithValuation: "先把目前估價當作快速參考，優先保護品相，再決定是否長期收藏。",
    collectionAdviceDefault: "建議先保護品相，再結合版別和鑄記判斷是否長期收藏。",
  },
  prompts: {
    usage: "用法: node recognize.ts <img1> <img2> [token] [locale]",
    missingFiles: "請提供兩個圖片檔案",
  },
};
