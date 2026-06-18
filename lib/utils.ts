// lib/utils.ts v3.1
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 密码学安全的 [0, maxExclusive) 整数随机数生成器。
 * - 使用 Web Cryptography API (crypto.getRandomValues)，在 SSR 环境下回退到 Math.random。
 * - 使用拒绝采样避免模偏差，确保分布完全均匀。
 */
export function secureRandomInt(maxExclusive: number): number {
  if (maxExclusive <= 0) return 0;
  if (maxExclusive === 1) return 0;
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
      const MAX_UINT32 = 0xffffffff;
      const limit = Math.floor((MAX_UINT32 + 1) / maxExclusive) * maxExclusive;
      const buf = new Uint32Array(1);
      let x: number;
      do {
        crypto.getRandomValues(buf);
        x = buf[0];
      } while (x >= limit);
      return x % maxExclusive;
    }
  } catch {
    // fallthrough：隐私模式或不支持时回退
  }
  // 不安全回退：仅用于无 crypto 的环境
  return Math.floor(Math.random() * maxExclusive);
}

/** 生成一个随机 ID（仅用于本地历史记录标识，不是安全标识。 */
export function generateLocalId(len: number = 9): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i = 0; i < len; i++) {
    out += chars[secureRandomInt(chars.length)];
  }
  return out;
}

/** 对用户输入的名单文本进行清洗：过滤控制字符并截断。 */
export function sanitizeListInput(text: string, maxItems: number = 1000, maxItemLen: number = 200): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/[\x00-\x1f\u202e<>"']/g, '').slice(0, maxItemLen).trim())
    .filter((line) => line.length > 0)
    .slice(0, maxItems);
}
