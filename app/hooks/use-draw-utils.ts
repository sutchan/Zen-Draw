// hooks/use-draw-utils.ts v5.7.1 — 抽签动作相关的纯工具函数
/** 将数值钳制在 [min, max] 区间 */
export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

/** 清洗文本输入：去除控制字符并截断最大长度 */
export function sanitizeTextField(value: string, maxLen = 50): string {
  return value.replace(/[\x00-\x1f]/g, "").slice(0, maxLen);
}
