// hooks/draw-helpers.ts v3.3.0 — 抽取逻辑纯函数

import { secureRandomInt } from "@/lib/utils";
import type { DrawSettings } from "./draw-types";

// 错误消息使用 TranslationKey 类型，由调用方通过 i18n 系统翻译
export type ValidationErrorKey =
  | "errCustomListEmpty"
  | "errCustomListTooMany"
  | "errCustomListRange"
  | "minMaxError"
  | "errRangeInvalid"
  | "rangeError";

/**
 * 格式化数字：添加前缀、后缀、补零
 */
export function formatNumber(
  n: number,
  digits: number,
  prefix: string,
  suffix: string
): string {
  let str = n.toString();
  if (digits > 0) {
    str = str.padStart(Math.max(0, Math.floor(digits)), "0");
  }
  return `${prefix}${str}${suffix}`;
}

/**
 * 生成最终结果（用于抽取完成时）
 */
export function finalizeDraw(settings: {
  useCustomList: boolean;
  customList: string[];
  count: number;
  allowDuplicates: boolean;
  min: number;
  max: number;
  digits: number;
  prefix: string;
  suffix: string;
}): string[] {
  const { useCustomList, customList, count, allowDuplicates, min, max, digits, prefix, suffix } = settings;
  const safeCount = Math.max(1, Math.min(1000, Number.isFinite(count) ? count : 1));

  if (useCustomList && customList.length > 0) {
    if (allowDuplicates) {
      return Array.from({ length: safeCount }, () => customList[secureRandomInt(customList.length)] as string);
    }
    const pool = [...customList];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = secureRandomInt(i + 1);
      const temp = pool[i] as string;
      pool[i] = pool[j] as string;
      pool[j] = temp;
    }
    return pool.slice(0, Math.min(safeCount, pool.length));
  }

  const safeMin = Number.isFinite(min) ? min : 0;
  const safeMax = Number.isFinite(max) ? max : 0;
  const range = Math.max(0, safeMax - safeMin + 1);

  if (allowDuplicates) {
    return Array.from({ length: safeCount }, () => formatNumber(secureRandomInt(range) + safeMin, digits, prefix, suffix));
  }
  const pool: number[] = Array.from({ length: range }, (_, i) => i + safeMin);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    const temp = pool[i] as number;
    pool[i] = pool[j] as number;
    pool[j] = temp;
  }
  return pool.slice(0, Math.min(safeCount, range)).map((n) => formatNumber(n, digits, prefix, suffix));
}

/**
 * 生成临时滚动值（动画过程中）
 */
export function generateTemporaryResults(settings: {
  useCustomList: boolean;
  customList: string[];
  count: number;
  min: number;
  max: number;
  digits: number;
  prefix: string;
  suffix: string;
}): string[] {
  const { useCustomList, customList, count, min, max, digits, prefix, suffix } = settings;
  const safeCount = Math.max(1, Math.min(1000, Number.isFinite(count) ? count : 1));

  if (useCustomList && customList.length > 0) {
    return Array.from({ length: safeCount }, () => customList[secureRandomInt(customList.length)] as string);
  }
  const safeMin = Number.isFinite(min) ? min : 0;
  const safeMax = Number.isFinite(max) ? max : 0;
  const range = Math.max(0, safeMax - safeMin + 1);
  return Array.from({ length: safeCount }, () => formatNumber(secureRandomInt(range) + safeMin, digits, prefix, suffix));
}

/**
 * 验证输入参数，返回错误信息或 null
 */
export function validateSettings(settings: {
  useCustomList: boolean;
  customList: string[];
  count: number;
  allowDuplicates: boolean;
  min: number;
  max: number;
}): ValidationErrorKey | null {
  const { useCustomList, customList, count, allowDuplicates, min, max } = settings;
  const safeCount = Math.max(1, Math.min(1000, Number.isFinite(count) ? count : 1));

  if (useCustomList) {
    if (customList.length === 0) {
      return "errCustomListEmpty";
    }
    if (customList.length > 1000) {
      return "errCustomListTooMany";
    }
    if (!allowDuplicates && safeCount > customList.length) {
      return "errCustomListRange";
    }
    return null;
  }

  const safeMin = Number.isFinite(min) ? min : 0;
  const safeMax = Number.isFinite(max) ? max : 0;
  const safeRange = safeMax - safeMin + 1;

  if (!Number.isFinite(safeMin) || !Number.isFinite(safeMax) || safeMin > safeMax) {
    return "minMaxError";
  }
  if (safeRange <= 0 || safeRange > 10_000_000) {
    return "errRangeInvalid";
  }
  if (!allowDuplicates && safeCount > safeRange) {
    return "rangeError";
  }
  return null;
}

// ---------------------------------------------------------------------------
// 默认设置
// ---------------------------------------------------------------------------


export const DEFAULT_SETTINGS: DrawSettings = {
  min: 1,
  max: 100,
  count: 1,
  allowDuplicates: true,
  autoHide: true,
  duration: 5,
  customList: [],
  useCustomList: false,
  digits: 3,
  prefix: "",
  suffix: "",
  language: "zh",
};
