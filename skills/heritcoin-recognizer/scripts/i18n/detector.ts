export type SupportedLocale =
  | "en"
  | "zh-CN"
  | "zh-TW"
  | "es"
  | "ja"
  | "ko"
  | "ru";

const LOCALE_PRIORITY = [
  "en-US",
  "en-GB",
  "zh-CN",
  "zh-TW",
  "zh-HK",
  "es-ES",
  "es-MX",
  "ja-JP",
  "ko-KR",
  "ru-RU",
];

const LOCALE_MAP: Record<string, SupportedLocale> = {
  en: "en",
  "en-us": "en",
  "en-gb": "en",
  "en-au": "en",
  "en-ca": "en",
  "zh-cn": "zh-CN",
  "zh-tw": "zh-TW",
  "zh-hk": "zh-TW",
  "zh-sg": "zh-CN",
  "zh-mo": "zh-TW",
  es: "es",
  "es-es": "es",
  "es-mx": "es",
  "es-ar": "es",
  ja: "ja",
  "ja-jp": "ja",
  ko: "ko",
  "ko-kr": "ko",
  ru: "ru",
  "ru-ru": "ru",
  "ru-ua": "ru",
  "ru-kz": "ru",
};

const LOCALE_LANGUAGE_CODE: Record<SupportedLocale, string> = {
  en: "en",
  "zh-CN": "zh",
  "zh-TW": "zh-TW",
  es: "es",
  ja: "ja",
  ko: "ko",
  ru: "ru",
};

const LOCALE_AREA_CODE: Record<SupportedLocale, string> = {
  en: "US",
  "zh-CN": "CN",
  "zh-TW": "TW",
  es: "ES",
  ja: "JP",
  ko: "KR",
  ru: "RU",
};

export function detectSystemLocale(): SupportedLocale {
  const envLang = process.env.LANG || process.env.LC_ALL || process.env.LANGUAGE;
  if (envLang) {
    const normalized = normalizeLocale(envLang);
    if (normalized) return normalized;
  }

  try {
    const locale =
      Intl.DateTimeFormat().resolvedOptions().locale ||
      Intl.NumberFormat().resolvedOptions().locale;
    const normalized = normalizeLocale(locale);
    if (normalized) return normalized;
  } catch {}

  const lang = process.env.LANG || "";
  for (const priority of LOCALE_PRIORITY) {
    if (lang.toLowerCase().startsWith(priority.toLowerCase())) {
      const result = normalizeLocale(priority);
      if (result) return result;
    }
  }

  return "en";
}

export function normalizeLocale(locale: string): SupportedLocale | null {
  const cleanLocale = locale.split(".")[0].replace(/_/g, "-").toLowerCase();
  return LOCALE_MAP[cleanLocale] || LOCALE_MAP[cleanLocale.split("-")[0]] || null;
}

export function detectLocaleFromText(text: string): SupportedLocale | null {
  const normalizedText = text.trim();
  if (!normalizedText) {
    return null;
  }

  if (/[\u3040-\u30ff]/.test(normalizedText)) {
    return "ja";
  }

  if (/[\uac00-\ud7af]/.test(normalizedText)) {
    return "ko";
  }

  if (/[\u0400-\u04ff]/.test(normalizedText)) {
    return "ru";
  }

  if (/[\u3400-\u9fff\uf900-\ufaff]/.test(normalizedText)) {
    return "zh-CN";
  }

  if (/[¿¡ñáéíóúü]/i.test(normalizedText)) {
    return "es";
  }

  if (/[A-Za-z]/.test(normalizedText)) {
    return "en";
  }

  return null;
}

function resolveLocaleForCodes(locale?: SupportedLocale | string): SupportedLocale {
  if (locale) {
    const normalized = typeof locale === "string" ? normalizeLocale(locale) : locale;
    if (normalized) {
      return normalized;
    }
  }

  return detectSystemLocale();
}

export function getLanguageCode(locale?: SupportedLocale | string): string {
  return LOCALE_LANGUAGE_CODE[resolveLocaleForCodes(locale)];
}

export function getAreaCode(locale?: SupportedLocale | string): string {
  return LOCALE_AREA_CODE[resolveLocaleForCodes(locale)];
}

export function getSystemLanguageCode(): string {
  return getLanguageCode();
}

export function getSystemAreaCode(): string {
  return getAreaCode();
}
