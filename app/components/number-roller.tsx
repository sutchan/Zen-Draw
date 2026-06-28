// components/number-roller.tsx v2.1 —— 数字滚动动画组件（字符级滚动 + 逐字定格）
"use client";

import * as React from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { cn, secureRandomInt } from "@/lib/utils";

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
 * 3. isDrawing=false 时：字符从**左到右逐字定格**（老虎机停转效果），带有缩放 + 弹性动画
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

  // 2. 拆分字符，每个字符独立渲染
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
          // 使用稳定 key 让组件在滚动期间持续存活
          key={`char-${idx}`}
          target={ch}
          isDrawing={isDrawing}
          // 从左到右逐字延迟停止（老虎机效果）
          stopDelay={idx * 80}
        />
      ))}
    </div>
  );
}

/**
 * 单个滚动字符
 * - 滚动期间：每 80ms 随机显示一个数字/字母（与 target 字符类型匹配）
 * - 停止时：等待 stopDelay 毫秒后以弹性动画「定格」到最终字符
 */
interface RollingCharProps {
  target: string;
  isDrawing: boolean;
  stopDelay: number;
}

function RollingChar({ target, isDrawing, stopDelay }: RollingCharProps) {
  // 当前显示的字符
  const [display, setDisplay] = React.useState(target);
  // 当前阶段
  const [phase, setPhase] = React.useState<"rolling" | "settling">("settling");

  // 引用上一轮 isDrawing 以检测变化方向
  const prevDrawingRef = React.useRef(isDrawing);

  // ------------------------------------------------------------------
  // 阶段转换：isDrawing 变化时驱动
  // ------------------------------------------------------------------
  React.useEffect(() => {
    const wasDrawing = prevDrawingRef.current;
    prevDrawingRef.current = isDrawing;

    if (isDrawing && !wasDrawing) {
      // isDrawing 从 false → true：立即进入滚动
      setPhase("rolling");
    } else if (!isDrawing && wasDrawing) {
      // isDrawing 从 true → false：等待 stopDelay 后再定格
      const timer = window.setTimeout(() => {
        setPhase("settling");
        setDisplay(target);
      }, stopDelay);
      return () => window.clearTimeout(timer);
    } else if (!isDrawing) {
      // 非滚动状态下确保显示目标值
      setDisplay(target);
    }
  }, [isDrawing, target, stopDelay]);

  // ------------------------------------------------------------------
  // 滚动定时器：phase="rolling" 时周期性随机切换字符
  // ------------------------------------------------------------------
  React.useEffect(() => {
    if (phase !== "rolling") return;

    const id = window.setInterval(() => {
      setDisplay(rollChar(target));
    }, 80);

    return () => window.clearInterval(id);
  }, [phase, target]);

  // ------------------------------------------------------------------
  // 字符类型匹配的随机字符生成
  // ------------------------------------------------------------------
  const rollChar = React.useCallback((t: string): string => {
    if (/\d/.test(t)) return String(secureRandomInt(10));
    if (/[a-z]/.test(t)) return String.fromCharCode(97 + secureRandomInt(26));
    if (/[A-Z]/.test(t)) return String.fromCharCode(65 + secureRandomInt(26));
    return t;
  }, []);

  // ------------------------------------------------------------------
  // 渲染：AnimatePresence 驱动入场/出场弹簧动画
  // ------------------------------------------------------------------
  return (
    <span
      className="inline-flex items-center justify-center select-none min-w-[1ch]"
      aria-hidden="false"
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          key={`${phase}-${display}`}
          initial={
            phase === "settling"
              ? { scale: 1.6, opacity: 0, y: -16, filter: "blur(6px)" }
              : { scale: 1, opacity: 1, y: 0, filter: "blur(0px)" }
          }
          animate={{
            scale: 1,
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          exit={
            phase === "rolling"
              ? { scale: 0.75, opacity: 0.4, y: 10, filter: "blur(4px)" }
              : { scale: 0.6, opacity: 0, y: 16, filter: "blur(8px)" }
          }
          transition={{
            type: phase === "settling" ? "spring" : "tween",
            // 定格时用更强劲的弹簧：稍有 overshoot 造成「弹跳感」
            stiffness: phase === "settling" ? 400 : 300,
            damping: phase === "settling" ? 16 : 20,
            mass: phase === "settling" ? 0.55 : 0.7,
            duration: phase === "settling" ? undefined : 0.06,
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
