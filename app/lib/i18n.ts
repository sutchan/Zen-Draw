// lib/i18n.ts v3.3.0 — 国际化翻译工具
import { translations, type Language, type TranslationKey } from "@/locales";

/**
 * 创建翻译器函数
 * 在组件中使用： const t = React.useMemo(() => createTranslator(language), [language]);
 * 然后调用 t('ready') 获取翻译文本
 */
export function createTranslator(language: Language) {
  const dict = translations[language];
  return (key: TranslationKey, ...args: string[]): string => {
    let text = dict[key];
    // 支持参数替换：{0}, {1}, ...
    args.forEach((arg, i) => {
      text = text.replace(`{${i}}`, arg);
    });
    return text;
  };
}
