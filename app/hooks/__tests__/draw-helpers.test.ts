/// <reference types="vitest/globals" />
import { describe, it, expect } from "vitest";
import {
  formatNumber,
  finalizeDraw,
  generateTemporaryResults,
  validateSettings,
  toSettings,
  DEFAULT_SETTINGS,
} from "../draw-helpers";
import type { DrawSettings } from "../draw-types";

function makeSettings(overrides: Partial<DrawSettings> = {}): DrawSettings {
  return { ...DEFAULT_SETTINGS, ...overrides };
}

describe("formatNumber", () => {
  it("补零到指定位数", () => {
    expect(formatNumber(7, 3, "", "")).toBe("007");
  });
  it("加前缀后缀", () => {
    expect(formatNumber(42, 2, "NO.", "-X")).toBe("NO.42-X");
  });
  it("digits 为 0 时不补零", () => {
    expect(formatNumber(5, 0, "", "")).toBe("5");
  });
  it("位数超过数字长度不截断", () => {
    expect(formatNumber(1234, 2, "", "")).toBe("1234");
  });
});

describe("validateSettings - 自定义列表", () => {
  it("空列表返回 errCustomListEmpty", () => {
    const err = validateSettings(makeSettings({ useCustomList: true, customList: [], count: 1 }));
    expect(err).toBe("errCustomListEmpty");
  });
  it("列表超 1000 项返回 errCustomListTooMany", () => {
    const list = Array.from({ length: 1001 }, (_, i) => `item${i}`);
    const err = validateSettings(makeSettings({ useCustomList: true, customList: list, count: 1 }));
    expect(err).toBe("errCustomListTooMany");
  });
  it("不重复但数量超过列表长度返回 errCustomListRange", () => {
    const err = validateSettings(
      makeSettings({ useCustomList: true, customList: ["a", "b"], count: 5, allowDuplicates: false }),
    );
    expect(err).toBe("errCustomListRange");
  });
  it("合法自定义列表返回 null", () => {
    const err = validateSettings(
      makeSettings({ useCustomList: true, customList: ["a", "b", "c"], count: 2, allowDuplicates: false }),
    );
    expect(err).toBeNull();
  });
});

describe("validateSettings - 数字范围", () => {
  it("min 大于 max 返回 minMaxError", () => {
    const err = validateSettings(makeSettings({ min: 10, max: 1, count: 1 }));
    expect(err).toBe("minMaxError");
  });
  it("范围超过 1000 万返回 errRangeInvalid", () => {
    const err = validateSettings(makeSettings({ min: 1, max: 10_000_001, count: 1 }));
    expect(err).toBe("errRangeInvalid");
  });
  it("不重复但数量超过范围返回 rangeError", () => {
    const err = validateSettings(makeSettings({ min: 1, max: 3, count: 5, allowDuplicates: false }));
    expect(err).toBe("rangeError");
  });
  it("合法数字范围返回 null", () => {
    const err = validateSettings(makeSettings({ min: 1, max: 100, count: 1, allowDuplicates: true }));
    expect(err).toBeNull();
  });
});

describe("finalizeDraw", () => {
  it("数字模式返回 count 个格式化结果", () => {
    const res = finalizeDraw(makeSettings({ min: 1, max: 10, count: 3, allowDuplicates: true, digits: 2 }));
    expect(res).toHaveLength(3);
    res.forEach((r) => expect(r).toMatch(/^\d{2}$/));
  });
  it("数字模式不重复时结果去重", () => {
    const res = finalizeDraw(makeSettings({ min: 1, max: 5, count: 5, allowDuplicates: false }));
    expect(new Set(res).size).toBe(5);
  });
  it("自定义列表模式返回 count 个列表项", () => {
    const list = ["x", "y", "z"];
    const res = finalizeDraw(makeSettings({ useCustomList: true, customList: list, count: 2, allowDuplicates: false }));
    expect(res).toHaveLength(2);
    res.forEach((r) => expect(list).toContain(r));
  });
  it("count 上限钳制为 1000", () => {
    const res = finalizeDraw(makeSettings({ min: 1, max: 5, count: 99999, allowDuplicates: true }));
    expect(res.length).toBeLessThanOrEqual(1000);
  });
  it("非有限 count 回退为 1", () => {
    const res = finalizeDraw(makeSettings({ min: 1, max: 5, count: NaN, allowDuplicates: true }));
    expect(res).toHaveLength(1);
  });
});

describe("generateTemporaryResults", () => {
  it("数字模式返回 count 个结果", () => {
    const res = generateTemporaryResults(makeSettings({ min: 1, max: 50, count: 4 }));
    expect(res).toHaveLength(4);
  });
  it("自定义列表模式返回列表项", () => {
    const list = ["a", "b"];
    const res = generateTemporaryResults(makeSettings({ useCustomList: true, customList: list, count: 3 }));
    res.forEach((r) => expect(list).toContain(r));
  });
  it("空自定义列表回退到数字模式", () => {
    const res = generateTemporaryResults(makeSettings({ useCustomList: true, customList: [], min: 1, max: 9, count: 2 }));
    expect(res).toHaveLength(2);
  });
});

describe("toSettings", () => {
  it("剥离运行时字段，保留设置字段", () => {
    const full = makeSettings();
    const snapshot = toSettings(full);
    const keys = Object.keys(snapshot).sort();
    expect(keys).toEqual(Object.keys(DEFAULT_SETTINGS).sort());
    expect(snapshot).toEqual(DEFAULT_SETTINGS);
  });
});
