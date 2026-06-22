// components/draw/draw-button.tsx v2.0 —— 抽取主按钮（增强交互反馈）
"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface DrawButtonProps {
  isDrawing: boolean;
  onStart: () => void;
  onStop: () => void;
  canDraw: boolean;
  language: "zh" | "en";
}

export function DrawButton({
  isDrawing,
  onStart,
  onStop,
  canDraw,
  language,
}: DrawButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  const t = {
    start: language === "zh" ? "开始抽取" : "Start Draw",
    stop: language === "zh" ? "停止（空格键）" : "Stop (Space)",
    ready: language === "zh" ? "按下按钮或空格键开始" : "Click the button or press Space to start",
  };

  // 按钮尺寸根据状态动态调整
  const btnSize = isDrawing ? "min-w-[280px] min-h-[84px] text-2xl" : "min-w-[240px] min-h-[72px] text-xl";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: shouldReduceMotion ? 0 : 0.5 }}
      className="relative pb-8 sm:pb-12 flex flex-col items-center"
    >
      {/* 脉冲背景光晕（仅在未抽取且可用状态显示） */}
      {!isDrawing && canDraw && !shouldReduceMotion && (
        <>
          <motion.div
            aria-hidden="true"
            className="absolute"
            style={{
              left: "50%",
              top: "50%",
              width: "300px",
              height: "100px",
              marginLeft: "-150px",
              marginTop: "-50px",
              borderRadius: "9999px",
              background: "radial-gradient(ellipse, hsl(var(--primary) / 0.18) 0%, transparent 70%)",
              zIndex: 0,
            }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute"
            style={{
              left: "50%",
              top: "50%",
              width: "220px",
              height: "76px",
              marginLeft: "-110px",
              marginTop: "-38px",
              borderRadius: "9999px",
              background: "radial-gradient(ellipse, hsl(var(--primary) / 0.25) 0%, transparent 70%)",
              zIndex: 0,
            }}
            animate={{
              scale: [1.05, 0.95, 1.05],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: -0.4,
            }}
          />
        </>
      )}

      {/* 主按钮 */}
      <motion.button
        onClick={isDrawing ? onStop : onStart}
        disabled={!canDraw && !isDrawing}
        aria-pressed={isDrawing}
        aria-label={isDrawing ? t.stop : t.start}
        className={cn(
          "relative z-10",
          btnSize,
          "px-12 py-5 rounded-[1.75rem]",
          "font-semibold tracking-wide text-white",
          "shadow-[0_10px_40px_hsl(var(--primary)/0.35)]",
          "transition-all duration-300 ease-out",
          // 焦点样式
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:ring-offset-4 focus-visible:ring-offset-background",
          // 状态样式
          canDraw || isDrawing
            ? "cursor-pointer hover:shadow-[0_14px_56px_hsl(var(--primary)/0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] bg-primary"
            : "cursor-not-allowed opacity-60 bg-muted text-muted-foreground",
          // 动态色彩（抽取中为红色）
          isDrawing && "bg-destructive hover:bg-destructive shadow-[0_10px_40px_rgba(239,68,68,0.4)]"
        )}
        style={{
          background: isDrawing
            ? "linear-gradient(135deg, hsl(0 84% 60%) 0%, hsl(0 72% 50%) 100%)"
            : undefined,
        }}
        whileHover={!shouldReduceMotion && (canDraw || isDrawing) ? { y: -2, scale: 1.02 } : undefined}
        whileTap={!shouldReduceMotion && (canDraw || isDrawing) ? { y: 0, scale: 0.98 } : undefined}
        role="button"
      >
        {/* 按钮内部动画状态 */}
        <div className="flex items-center justify-center gap-3">
          {/* 圆点指示器 */}
          <motion.span
            className={cn(
              "inline-block rounded-full",
              isDrawing ? "bg-red-300" : "bg-primary-foreground/80"
            )}
            animate={
              isDrawing
                ? {
                    scale: [1, 1.4, 1],
                    opacity: [0.8, 1, 0.8],
                  }
                : { scale: 1 }
            }
            transition={
              isDrawing
                ? { duration: 0.7, repeat: Infinity, ease: "easeInOut" }
                : undefined
            }
            style={{ width: "14px", height: "14px" }}
            aria-hidden="true"
          />
          <span className="font-semibold tracking-wide">
            {isDrawing ? t.stop : t.start}
          </span>
        </div>
      </motion.button>

      {/* 底部提示文本 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-5 text-sm text-muted-foreground text-center"
        aria-hidden="true"
      >
        {isDrawing ? t.stop : t.ready}
      </motion.p>
    </motion.div>
  );
}
