/// <reference types="vitest/globals" />
import { describe, it, expect } from "vitest";
import { SETTINGS_FIELDS } from "../draw-types";
import type { DrawSettings } from "../draw-types";
import { DEFAULT_SETTINGS, toSettings } from "../draw-helpers";

/**
 * 编译期守卫：SETTINGS_FIELDS 必须完整覆盖 DrawSettings 的全部键。
 * 若日后新增设置项却忘记登记到 SETTINGS_FIELDS，此处会直接编译报错。
 */
type MissingFromFields = Exclude<keyof DrawSettings, (typeof SETTINGS_FIELDS)[number]>;
type ExtraInFields = Exclude<(typeof SETTINGS_FIELDS)[number], keyof DrawSettings>;
const _exhaustiveCheck: [MissingFromFields, ExtraInFields] = [
  [] as MissingFromFields,
  [] as ExtraInFields,
];

describe("SETTINGS_FIELDS 单一事实来源", () => {
  it("完整覆盖 DrawSettings 全部字段（无遗漏、无多余）", () => {
    const typeKeys = Object.keys(DEFAULT_SETTINGS).sort();
    const fieldKeys = [...SETTINGS_FIELDS].sort();
    expect(fieldKeys).toEqual(typeKeys);
    // 编译期守卫（避免未使用变量告警）
    expect(_exhaustiveCheck).toHaveLength(2);
  });

  it("字段清单无重复项", () => {
    const unique = new Set(SETTINGS_FIELDS);
    expect(unique.size).toBe(SETTINGS_FIELDS.length);
  });
});

describe("toSettings", () => {
  it("仅返回设置字段，剥离运行时字段", () => {
    const state = {
      ...DEFAULT_SETTINGS,
      currentResults: ["1"],
      rollingValues: ["2"],
      status: "result" as const,
      errorMessage: "err",
      history: [],
      isRolling: false,
    };
    const snapshot = toSettings(state);
    expect(Object.keys(snapshot).sort()).toEqual([...SETTINGS_FIELDS].sort());
    expect("status" in snapshot).toBe(false);
    expect("history" in snapshot).toBe(false);
  });

  it("逐字段保持取值一致", () => {
    const snapshot = toSettings(DEFAULT_SETTINGS);
    for (const field of SETTINGS_FIELDS) {
      expect(snapshot[field]).toEqual(DEFAULT_SETTINGS[field]);
    }
  });
});
