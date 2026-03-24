import type { LocaleContent } from "./en.ts";

export const zhCN: LocaleContent = {
  labels: {
    valuation: "估价",
    name: "名称",
    year: "年份",
    region: "国家/地区",
    denomination: "面值",
    mintage: "铸造量",
    krauseNumber: "Krause编号",
    material: "材质",
    diameter: "直径",
    thickness: "厚度",
    weight: "重量",
    obverse: "正面",
    reverse: "背面",
    details: "详细信息",
    collectionAdvice: "收藏建议",
  },
  messages: {
    recognitionResult: "识别结果",
    uploading: "正在上传文件到服务器...",
    uploadComplete: "文件上传完成",
    recognitionFailed: "识别失败",
    notCoin: "未识别为硬币，可能是其他物品",
    error: "错误",
    collectionAdviceWithValuation: "先把当前估价当作快速参考，优先保护品相，再决定是否长期收藏。",
    collectionAdviceDefault: "建议先保护品相，再结合版别和铸记判断是否长期收藏。",
  },
  prompts: {
    usage: "用法: node recognize.ts <img1> <img2> [token] [locale]",
    missingFiles: "请提供两个图片文件",
  },
};
