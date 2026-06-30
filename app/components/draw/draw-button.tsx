// components/draw/draw-button.tsx v3.3.0 —— 抽取主按钮（增强交互反馈）
"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { createTranslator } from "@/lib/i18n";
export interface DrawButtonProps {
  // 是否正在抽取中
  isDrawing: boolean;
  // 开始 / 停止 时回调
  onStart: () => void;
  onStop: () => void;
  // 是否可用（设置不合法时禁用）
  canDraw: boolean;
  // 显示语言
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

  const t = React.useMemo(() => createTranslator(language), [language]);

  // 处理点击 — 原生 <button> 自动支持 Enter/Space 触发
  const handleClick = React.useCallback(() => {
    if (!canDraw && !isDrawing) return;
    if (isDrawing) onStop();
    else onStart();
  }, [canDraw, isDrawing, onStart, onStop]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: shouldReduceMotion ? 0 : 0.5 }}
      className="relative pb-8 sm:pb-12 flex flex-col items-center"
      aria-hidden="false"
    >
      {/* 脉冲背景光晕（空闲时呼吸效果，仅无偏好减少动画时显示） */}
      {!isDrawing && canDraw && !shouldReduceMotion && (
        <>
          <motion.div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 rounded-full pointer-events-none"
            style={{
              width: "340px",
              height: "110px",
              marginLeft: "-170px",
              marginTop: "-55px",
              background:
                "radial-gradient(ellipse, hsl(var(--primary) / 0.18) 0%, transparent 70%)",
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
            className="absolute left-1/2 top-1/2 rounded-full pointer-events-none"
            style={{
              width: "240px",
              height: "80px",
              marginLeft: "-120px",
              marginTop: "-40px",
              background:
                "radial-gradient(ellipse, hsl(var(--primary) / 0.28) 0%, transparent 70%)",
            }}
            animate={{
              scale: [1.05, 0.95, 1.05],
              opacity: [0.85, 1, 0.85],
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

      {/* 主按钮 — 原生 <button> 自动支持 Enter/Space，无需自定义 onKeyDown */}
      <motion.button
        onClick={handleClick}
        disabled={!canDraw && !isDrawing}
        aria-pressed={isDrawing}
        aria-label={isDrawing ? t("stopDraw") : t("startDraw")}
        className={cn(
          "relative z-10",
          "px-12 py-5 rounded-[1.75rem]",
          "font-semibold tracking-wide text-primary-foreground",
          "shadow-[0_10px_40px_hsl(var(--primary)/0.35)]",
          "transition-all duration-300 ease-out",
          // 焦点样式（无障碍）
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:ring-offset-4 focus-visible:ring-offset-background",
          // 状态样式
          canDraw || isDrawing
            ? "cursor-pointer hover:shadow-[0_14px_56px_hsl(var(--primary)/0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] bg-primary"
            : "cursor-not-allowed opacity-60 bg-muted text-muted-foreground",
          // 抽取中 —— 破坏性色彩 + 指示点动画
          isDrawing && "bg-destructive hover:bg-destructive text-white shadow-[0_10px_40px_hsl(var(--destructive)/0.4)]",
          // 响应式尺寸
          "min-w-[240px] min-h-[72px] text-xl"
        )}
        {...(!shouldReduceMotion && (canDraw || isDrawing) ? {
          whileHover: { y: -2, scale: 1.02 },
          whileTap: { y: 0, scale: 0.98 },
        } : {})}
        role="button"
        tabIndex={0}
      >
        {/* 按钮内部动画状态 */}
        <div className="flex items-center justify-center gap-3">
          {/* 抽取中：跳动的红点；空闲时：静态小点 */}
          <motion.span
            className={cn(
              "inline-block rounded-full",
              isDrawing ? "bg-white/90" : "bg-white/80"
            )}
            style={{ width: "14px", height: "14px" }}
            animate={
              isDrawing
                ? {
                    scale: [1, 1.5, 1],
                    opacity: [0.8, 1, 0.8],
                  }
                : { scale: 1 }
            }
            {...(isDrawing ? { transition: { duration: 0.7, repeat: Infinity, ease: "easeInOut" } } : {})}
            aria-hidden="true"
          />
          <span className="font-semibold tracking-wide">
            {isDrawing ? t("stopDraw") : t("startDraw")}
          </span>
        </div>
      </motion.button>

      {/* 底部提示文本 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-5 text-sm text-muted-foreground text-center max-w-md"
      >
        {isDrawing ? t("stopHint") : t("startHint")}
      </motion.p>
    </motion.div>
  );
}
