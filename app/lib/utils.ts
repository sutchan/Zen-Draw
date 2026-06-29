// lib/utils.ts v3.3.0 — 工具函数模块
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 组合 Tailwind CSS 类名，解决冲突并合并
 * 使用 clsx 处理条件类名，tailwind-merge 处理冲突优先级
 * @param inputs - 任意结构的类名输入
 * @returns 合并后的类名字符串
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * 使用加密安全的随机数生成器（crypto.getRandomValues）
 * 替代 Math.random()，提升抽奖结果的不可预测性
 * @param max - 上界（不包含）
 * @returns 0 到 max-1 范围内的整数
 */
export function secureRandomInt(max: number): number {
  if (max <= 0) return 0;
  // 使用 crypto 生成均匀分布的随机整数，避免取模偏差
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const maxUint32 = 0xffffffff;
    const limit = Math.floor((maxUint32 + 1) / max) * max;
    const arr = new Uint32Array(1);
    let value: number;
    do {
      crypto.getRandomValues(arr);
      value = arr[0] as number;
    } while (value >= limit);
    return value % max;
  }
  // 降级方案：Node.js 环境或旧浏览器
  return Math.floor(Math.random() * max);
}

/**
 * 生成本地唯一 ID（不需要 UUID 完整标准）
 * 使用时间戳 + 密码学安全随机数组合，保证本地唯一性
 */
export function generateLocalId(): string {
  const timePart = Date.now().toString(36);
  // 使用 crypto.getRandomValues() 生成安全随机字符串
  const randomBytes = new Uint32Array(2);
  crypto.getRandomValues(randomBytes);
  const randomPart = Array.from(randomBytes)
    .map((n) => n.toString(36))
    .join("")
    .slice(0, 10);
  return `${timePart}-${randomPart}`;
}

/**
 * 安全的数字解析：确保结果是有限数字，防止 NaN/Infinity 写入
 * @param input - 原始输入字符串
 * @param fallback - 失败时的回退值
 */
export function parseFiniteNumber(input: string, fallback: number): number {
  const n = Number(input);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * 清理名单输入字符串：
 * - 按换行切分
 * - 去除首尾空白
 * - 过滤控制字符（防止 XSS 和格式问题）
 * - 限制单项最长 200 字符、最多 1000 项，防止性能 DoS
 */
export function sanitizeListInput(input: string): string[] {
  if (!input || typeof input !== "string") return [];
  // 移除常见控制字符：\r \t 和其它 ASCII 控制字符（保留普通中文/英文内容）
  const sanitized = input
    .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");
  return sanitized
    .split("\n")
    .map((line) => line.trim().slice(0, 200))
    .filter((line) => line.length > 0)
    .slice(0, 1000);
}
