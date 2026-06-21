// components/number-roller.tsx v1.0 — 数字滚动组件
// 负责：接收结果字符串并以滚动动画呈现
"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface NumberRollerProps {
  value: string;
  isDrawing: boolean;
  className?: string;
}

/**
 * NumberRoller 数字滚动组件
 * - 将输入字符串按字符分割，每个字符独立动画
 * - isDrawing=true 时显示闪烁/滚动的占位字符
 * - 支持 reduced-motion 用户偏好（尊重无障碍标准）
 */
export function NumberRoller({ value, isDrawing, className }: NumberRollerProps): React.ReactNode {
  const shouldReduceMotion = useReducedMotion();
  // 限制字符数上限 200，防止超长内容触发性能 DoS
  const chars = value.length > 0 ? Array.from(value).slice(0, 200) : [];

  if (chars.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center tabular-nums flex-wrap",
        className
      )}
      aria-live="polite"
      aria-label={`Result: ${value}`}
    >
      {chars.map((ch, idx) => (
        <motion.span
          key={`${idx}-${ch}`}
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.8 }}
          animate={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 1, y: 0, scale: 1 }
          }
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            mass: 0.8,
            delay: idx * 0.03,
          }}
          className="inline-block"
        >
          {isDrawing ? (
            <motion.span
              animate={shouldReduceMotion ? { opacity: [1, 0.6, 1] } : { opacity: [1, 0.5, 1] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: idx * 0.05,
              }}
              className="inline-block"
              aria-hidden="true"
            >
              {/* 滚动中的占位字符：使用等宽数字的形状 ● */}
              {/\d/.test(ch) ? "8" : ch === " " ? "\u00A0" : ch}
            </motion.span>
          ) : (
            <span>{ch}</span>
          )}
        </motion.span>
      ))}
    </div>
  );
}
