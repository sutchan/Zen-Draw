// components/number-roller.tsx v2.0 —— 数字滚动动画组件（字符级滚动）
"use client";

import * as React from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export interface NumberRollerProps {
  // 要显示的值（字符串 —— 支持任意字符）
  value: string;
  // 是否正在滚动（true 时字符快速翻动，false 时显示最终值）
  isDrawing: boolean;
  // 自定义类名
  className?: string;
}

/**
 * NumberRoller 数字滚动组件
 *
 * 核心设计：
 * 1. 将 value 按字符切片，每个字符独立动画
 * 2. isDrawing=true 时：每个字符位置显示一个循环变化的数字/字符，呈现"滚动"效果
 * 3. isDrawing=false 时：显示最终字符，带有缩放 + 透明度过渡
 * 4. 尊重 prefers-reduced-motion：偏好减少动画的用户直接显示文本
 */
export function NumberRoller({ value, isDrawing, className }: NumberRollerProps) {
  const shouldReduceMotion = useReducedMotion();

  // 1. 尊重无障碍偏好：如果用户偏好减少动画，直接渲染静态文本
  if (shouldReduceMotion) {
    return (
      <span
        className={cn("tabular-nums", className)}
        aria-live="polite"
        aria-label={`结果: ${value}`}
      >
        {value}
      </span>
    );
  }

  // 2. 拆分字符
  const chars = Array.from(value);

  return (
    <div
      className={cn(
        "flex items-center justify-center tabular-nums flex-wrap",
        className
      )}
      aria-label={`结果: ${value}`}
      aria-live="polite"
    >
      {chars.map((ch, idx) => (
        <RollingChar
          key={`${idx}-${ch}-${isDrawing ? "rolling" : "static"}`}
          target={ch}
          isDrawing={isDrawing}
          delay={idx * 0.02}
        />
      ))}
    </div>
  );
}

/**
 * 单个滚动字符
 * - 滚动期间：每 80ms 随机显示一个数字/字母（与 target 字符类型匹配）
 * - 停止时：平滑缩放过渡到最终字符
 */
interface RollingCharProps {
  target: string;
  isDrawing: boolean;
  delay: number;
}

function RollingChar({ target, isDrawing, delay }: RollingCharProps) {
  // 使用单个 useReducer 管理 stage 和 display，effect 中通过 dispatch 更新，避免同步 setState
  // stage: 0 = rolling, 1 = settling; display: 当前显示的字符
  const [state, dispatch] = React.useReducer(
    (prev: { stage: number; display: string }, action: { type: "ROLL"; display: string } | { type: "SETTLE"; display: string }) => {
      if (action.type === "ROLL") {
        return { stage: 0, display: action.display };
      }
      return { stage: 1, display: action.display };
    },
    { stage: isDrawing ? 0 : 1, display: target }
  );
  const { stage, display } = state;

  // 3. 滚动动画的随机字符生成
  const rollChar = React.useCallback((t: string): string => {
    if (/\d/.test(t)) {
      return String(Math.floor(Math.random() * 10));
    }
    if (/[a-z]/.test(t)) {
      return String.fromCharCode(97 + Math.floor(Math.random() * 26));
    }
    if (/[A-Z]/.test(t)) {
      return String.fromCharCode(65 + Math.floor(Math.random() * 26));
    }
    return t;
  }, []);

  // 4. 管理滚动定时器（通过 dispatch 更新状态，无同步 setState）
  React.useEffect(() => {
    let intervalId: number | null = null;

    if (isDrawing) {
      dispatch({ type: "ROLL", display: rollChar(target) });
      intervalId = window.setInterval(() => {
        dispatch({ type: "ROLL", display: rollChar(target) });
      }, 80);
    } else {
      dispatch({ type: "SETTLE", display: target });
    }

    return () => {
      if (intervalId !== null) {
        window.clearInterval(intervalId);
        intervalId = null;
      }
    };
  }, [isDrawing, target, rollChar]);

  // 5. 渲染：使用 AnimatePresence 做阶段切换动画
  return (
    <span
      className="inline-flex items-center justify-center select-none min-w-[1ch]"
      aria-hidden="false"
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          key={`${stage}-${display}`}
          initial={
            stage === 1
              ? { scale: 1.25, opacity: 0, y: -6, filter: "blur(3px)" }
              : { scale: 1, opacity: 1, y: 0, filter: "blur(0px)" }
          }
          animate={{
            scale: 1,
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          exit={{ scale: 0.75, opacity: 0, y: 8, filter: "blur(6px)" }}
          transition={{
            type: stage === 1 ? "spring" : "tween",
            stiffness: 280,
            damping: 22,
            mass: 0.8,
            duration: stage === 1 ? undefined : 0.1,
            delay,
          }}
          className="inline-block"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {display}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
