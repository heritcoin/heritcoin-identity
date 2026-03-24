import { en, type LocaleContent } from "./en.ts";
import { zhCN } from "./zh-CN.ts";
import { zhTW } from "./zh-TW.ts";
import { es } from "./es.ts";
import { ja } from "./ja.ts";
import { ko } from "./ko.ts";
import { ru } from "./ru.ts";
import {
  detectSystemLocale,
  detectLocaleFromText,
  normalizeLocale,
  getLanguageCode,
  getAreaCode,
  getSystemLanguageCode,
  getSystemAreaCode,
  type SupportedLocale,
} from "./detector.ts";

export const LOCALES: Record<SupportedLocale, LocaleContent> = {
  en,
  "zh-CN": zhCN,
  "zh-TW": zhTW,
  es,
  ja,
  ko,
  ru,
};

export const DEFAULT_LOCALE: SupportedLocale = "en";

export function getLocale(locale?: SupportedLocale | string): LocaleContent {
  if (locale) {
    const normalized =
      typeof locale === "string" ? normalizeLocale(locale) : locale;
    if (normalized && LOCALES[normalized]) {
      return LOCALES[normalized];
    }
  }
  return LOCALES[detectSystemLocale()] || LOCALES[DEFAULT_LOCALE];
}

export function getCurrentLocale(): SupportedLocale {
  return detectSystemLocale();
}

export {
  detectSystemLocale,
  detectLocaleFromText,
  normalizeLocale,
  getLanguageCode,
  getAreaCode,
  getSystemLanguageCode,
  getSystemAreaCode,
  type SupportedLocale,
};
export type { LocaleContent };
