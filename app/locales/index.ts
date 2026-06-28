// locales/index.ts v3.3.0 — 国际化翻译模块（入口）
export { type Language, type TranslationKey, type TranslationDict } from "./types";
export { enTranslations } from "./en";
export { zhTranslations } from "./zh";

import type { Language, TranslationDict } from "./types";
import { enTranslations } from "./en";
import { zhTranslations } from "./zh";

export const translations: Record<Language, TranslationDict> = {
  en: enTranslations,
  zh: zhTranslations,
};
