import type { LocaleContent } from "./en.ts";

export const ko: LocaleContent = {
  labels: {
    valuation: "평가",
    name: "이름",
    year: "연도",
    region: "국가/지역",
    denomination: "액면",
    mintage: "주조량",
    krauseNumber: "Krause 번호",
    material: "재질",
    diameter: "지름",
    thickness: "두께",
    weight: "무게",
    obverse: "앞면",
    reverse: "뒷면",
    details: "상세 정보",
    collectionAdvice: "수집 조언",
  },
  messages: {
    recognitionResult: "인식 결과",
    uploading: "파일을 서버에 업로드 중...",
    uploadComplete: "파일 업로드 완료",
    recognitionFailed: "인식 실패",
    notCoin: "동전으로 인식되지 않았습니다. 다른 물체일 수 있습니다",
    error: "오류",
    collectionAdviceWithValuation: "현재 평가액을 빠른 참고로만 보고, 장기 소장을 결정하기 전에 먼저 보존 상태를 지키는 데 집중하세요.",
    collectionAdviceDefault: "먼저 보존 상태를 지키고, 장기 소장 여부는 품종과 민트마크를 함께 확인한 뒤 결정하세요.",
  },
  prompts: {
    usage: "用法: node recognize.ts <img1> <img2> [token] [locale]",
    missingFiles: "두 개의 이미지 파일을 제공해 주세요",
  },
};
