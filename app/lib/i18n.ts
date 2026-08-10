// lib/i18n.ts v5.7.5 — 国际化翻译工具
import { translations, type Language, type TranslationKey } from "@/locales";

/**
 * 创建翻译器函数
 * 在组件中使用： const t = React.useMemo(() => createTranslator(language), [language]);
 * 然后调用 t('ready') 获取翻译文本
 */
export function createTranslator(language: Language) {
  const dict = translations[language];
  return (key: TranslationKey, ...args: string[]): string => {
    // 缺失 key 时回退到 key 本身，避免运行期 TypeError 导致白屏
    const fallback = dict[key] ?? (key as string);
    let text = fallback;
    // 支持参数替换：{0}, {1}, ...
    args.forEach((arg, i) => {
      text = text.replace(`{${i}}`, arg);
    });
    return text;
  };
}

