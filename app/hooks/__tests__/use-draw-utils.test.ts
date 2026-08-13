/// <reference types="vitest/globals" />
import { describe, it, expect } from "vitest";
import { clamp, sanitizeTextField } from "../use-draw-utils";

describe("clamp", () => {
  it("钳制到上界", () => {
    expect(clamp(120, 1, 100)).toBe(100);
  });
  it("钳制到下界", () => {
    expect(clamp(-5, 1, 100)).toBe(1);
  });
  it("区间内部原样返回", () => {
    expect(clamp(50, 1, 100)).toBe(50);
  });
});

describe("sanitizeTextField", () => {
  it("去除控制字符", () => {
    expect(sanitizeTextField("a\x00b\x1fc")).toBe("abc");
  });
  it("默认截断到 50 字符", () => {
    expect(sanitizeTextField("x".repeat(80))).toHaveLength(50);
  });
  it("自定义最大长度", () => {
    expect(sanitizeTextField("y".repeat(30), 10)).toHaveLength(10);
  });
});
