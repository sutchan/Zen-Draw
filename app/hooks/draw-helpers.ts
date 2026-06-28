// hooks/draw-helpers.ts — 抽取逻辑纯函数

import { secureRandomInt } from "@/lib/utils";
import type { DrawSettings } from "./draw-types";

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
      return Array.from({ length: safeCount }, () => customList[secureRandomInt(customList.length)]);
    }
    const pool = [...customList];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = secureRandomInt(i + 1);
      [pool[i], pool[j]] = [pool[j], pool[i]];
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
    [pool[i], pool[j]] = [pool[j], pool[i]];
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
    return Array.from({ length: safeCount }, () => customList[secureRandomInt(customList.length)]);
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
}): string | null {
  const { useCustomList, customList, count, allowDuplicates, min, max } = settings;
  const safeCount = Math.max(1, Math.min(1000, Number.isFinite(count) ? count : 1));

  if (useCustomList) {
    if (customList.length === 0) {
      return "请先在设置中导入自定义列表";
    }
    if (customList.length > 1000) {
      return "自定义列表项数过多，请减少到 1000 项以内";
    }
    if (!allowDuplicates && safeCount > customList.length) {
      return "不允许重复时，抽取数量不能超过列表项数";
    }
    return null;
  }

  const safeMin = Number.isFinite(min) ? min : 0;
  const safeMax = Number.isFinite(max) ? max : 0;
  const safeRange = safeMax - safeMin + 1;

  if (!Number.isFinite(safeMin) || !Number.isFinite(safeMax) || safeMin > safeMax) {
    return "最小值不能大于最大值";
  }
  if (safeRange <= 0 || safeRange > 10_000_000) {
    return "数值范围过大或无效，请调整范围";
  }
  if (!allowDuplicates && safeCount > safeRange) {
    return "不允许重复时，抽取数量不能超过数值范围";
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
