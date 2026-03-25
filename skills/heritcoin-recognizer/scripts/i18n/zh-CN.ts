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
    lettering: "铭文",
    description: "描述",
    creators: "设计者",
  },
  messages: {
    recognitionResult: "识别结果",
    uploading: "正在上传文件到服务器...",
    recognitionFailed: "识别失败",
    notCoin: "未识别为硬币，可能是其他物品",
    error: "错误",
    needTwoImages: "请上传同一枚钱币的2张图片。",
    needOneMoreImage: "请再补1张同一枚钱币的图片。",
    tooManyImages: "一次最多上传2张图，请重新上传",
    collectionAdviceWithValuation: "当前估价约 {valuation}，建议先保持原始状态。",
    collectionAdviceForCoinWithValuation: "这枚 {coin} 当前估价约 {valuation}，建议先保持原始状态。",
    collectionAdviceForCoin: "这枚 {coin} 建议先保持原始状态。",
    collectionAdviceDefault: "建议先保持原始状态。",
  },
  prompts: {
    recognizeUsage:
      "用法: node recognize.ts <img1> <img2> [--locale <locale>] [--token <token>]",
    resolveRequestUsage: "用法: node resolve-request.ts [session-file]",
    missingFiles: "请提供两个图片文件",
  },
};
