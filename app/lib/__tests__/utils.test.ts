/// <reference types="vitest/globals" />
import { describe, it, expect } from "vitest";
import {
  secureRandomInt,
  secureRandomFloat,
  generateLocalId,
  parseFiniteNumber,
  sanitizeListInput,
} from "../utils";

describe("secureRandomInt", () => {
  it("返回 [0, max) 内的整数", () => {
    for (let i = 0; i < 200; i++) {
      const v = secureRandomInt(10);
      expect(Number.isInteger(v)).toBe(true);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(10);
    }
  });

  it("max <= 0 时返回 0", () => {
    expect(secureRandomInt(0)).toBe(0);
    expect(secureRandomInt(-5)).toBe(0);
  });

  it("大边界无偏差（统计性检查）", () => {
    const buckets = new Array(6).fill(0);
    for (let i = 0; i < 6000; i++) buckets[secureRandomInt(6)]++;
    buckets.forEach((b) => expect(b).toBeGreaterThan(800));
  });
});

describe("secureRandomFloat", () => {
  it("返回 [min, max) 内的浮点数", () => {
    for (let i = 0; i < 200; i++) {
      const v = secureRandomFloat(2, 5);
      expect(v).toBeGreaterThanOrEqual(2);
      expect(v).toBeLessThan(5);
    }
  });

  it("max <= min 时返回 min", () => {
    expect(secureRandomFloat(3, 3)).toBe(3);
    expect(secureRandomFloat(5, 2)).toBe(5);
  });
});

describe("generateLocalId", () => {
  it("生成带分隔符的唯一 ID", () => {
    const a = generateLocalId();
    const b = generateLocalId();
    expect(a).toMatch(/^[\w]+-[\w]+$/);
    expect(a).not.toBe(b);
  });
});

describe("parseFiniteNumber", () => {
  it("解析有效数字", () => {
    expect(parseFiniteNumber("42", 0)).toBe(42);
    expect(parseFiniteNumber("-3.5", 0)).toBe(-3.5);
  });
  it("非数字回退", () => {
    expect(parseFiniteNumber("abc", 7)).toBe(7);
    expect(parseFiniteNumber("NaN", 1)).toBe(1);
    expect(parseFiniteNumber("Infinity", 1)).toBe(1);
  });
});

describe("sanitizeListInput", () => {
  it("按行拆分并去空白", () => {
    expect(sanitizeListInput(" a \n b \n c ")).toEqual(["a", "b", "c"]);
  });
  it("过滤空行与控制字符", () => {
    const res = sanitizeListInput("ok\n\n\x07bad\x1f");
    expect(res).toEqual(["ok", "bad"]);
  });
  it("截断单项到 200 字符", () => {
    const long = "x".repeat(500);
    const res = sanitizeListInput(long);
    expect(res[0]?.length).toBe(200);
  });
  it("限制最多 1000 项", () => {
    const input = Array.from({ length: 1500 }, (_, i) => `item${i}`).join("\n");
    expect(sanitizeListInput(input)).toHaveLength(1000);
  });
  it("非字符串输入返回空数组", () => {
    // @ts-expect-error 故意传入 null 以验证非字符串输入的运行时防护
    expect(sanitizeListInput(null)).toEqual([]);
  });
});
