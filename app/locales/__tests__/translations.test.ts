import { describe, it, expect } from "vitest";
import { translations, type TranslationKey } from "@/locales";
import { createTranslator } from "@/lib/i18n";

describe("i18n extended keys", () => {
  const newKeys: TranslationKey[] = [
    "errorPageTitle",
    "errorPageDesc",
    "errorRetry",
    "errorBackHome",
    "errorIdLabel",
    "notFoundTitle",
    "notFoundDesc",
    "notFoundBackHome",
    "skipToContent",
  ];

  it.each(newKeys)("has key %s in zh", (key) => {
    expect(translations.zh[key]).toBeDefined();
    expect(translations.zh[key].length).toBeGreaterThan(0);
  });

  it.each(newKeys)("has key %s in en", (key) => {
    expect(translations.en[key]).toBeDefined();
    expect(translations.en[key].length).toBeGreaterThan(0);
  });

  it("translates errorPageTitle correctly", () => {
    const tZh = createTranslator("zh");
    const tEn = createTranslator("en");
    expect(tZh("errorPageTitle")).toBe("出了点问题");
    expect(tEn("errorPageTitle")).toBe("Something Went Wrong");
  });

  it("translates notFoundTitle correctly", () => {
    const tZh = createTranslator("zh");
    const tEn = createTranslator("en");
    expect(tZh("notFoundTitle")).toBe("页面未找到");
    expect(tEn("notFoundTitle")).toBe("Page Not Found");
  });

  it("translates skipToContent correctly", () => {
    const tZh = createTranslator("zh");
    const tEn = createTranslator("en");
    expect(tZh("skipToContent")).toBe("跳到主内容");
    expect(tEn("skipToContent")).toBe("Skip to main content");
  });
});
