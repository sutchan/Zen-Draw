// components/draw/draw-button.tsx v5.0 —— 抽取主按钮（极简设计优化）
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

  // 处理点击
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
      className="relative flex flex-col items-center"
      aria-hidden="false"
    >
      {/* 脉冲背景光晕（仅非抽取状态且无忧动画偏好时显示） */}
      {!isDrawing && canDraw && !shouldReduceMotion && (
        <motion.div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 rounded-full pointer-events-none"
          style={{
            width: "280px",
            height: "90px",
            marginLeft: "-140px",
            marginTop: "-45px",
            background: "radial-gradient(ellipse, hsl(var(--primary) / 0.12) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* 主按钮 — 极简圆形设计 */}
      <motion.button
        onClick={handleClick}
        disabled={!canDraw && !isDrawing}
        aria-pressed={isDrawing}
        aria-label={isDrawing ? t("stopDraw") : t("startDraw")}
        className={cn(
          "relative z-10",
          // 圆形按钮 — 极简设计
          "w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] lg:w-[200px] lg:h-[200px]",
          "rounded-full",
          "font-semibold text-lg sm:text-xl",
          "text-primary-foreground",
          "shadow-[0_8px_32px_hsl(var(--primary)/0.3)]",
          "transition-all duration-300 ease-out",
          // 焦点样式（无障碍）
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:ring-offset-4 focus-visible:ring-offset-background",
          // 状态样式
          canDraw || isDrawing
            ? "cursor-pointer bg-primary hover:shadow-[0_12px_48px_hsl(var(--primary)/0.4)] hover:-translate-y-1 active:translate-y-0 active:scale-[0.98]"
            : "cursor-not-allowed opacity-50 bg-muted text-muted-foreground",
          // 抽取中 — 破坏性色彩
          isDrawing && "bg-destructive hover:bg-destructive text-white shadow-[0_8px_32px_hsl(var(--destructive)/0.4)]"
        )}
        {...(!shouldReduceMotion && (canDraw || isDrawing) ? {
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.98 },
        } : {})}
        role="button"
        tabIndex={0}
      >
        {/* 按钮内部 */}
        <div className="flex flex-col items-center justify-center gap-2">
          {/* 抽取中：脉冲点；空闲时：播放图标 */}
          {isDrawing ? (
            <motion.div
              className="w-3 h-3 rounded-full bg-white/90"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            />
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="opacity-80"
              aria-hidden="true"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
          <span className="font-semibold">
            {isDrawing ? t("stopDraw") : t("startDraw")}
          </span>
        </div>
      </motion.button>

      {/* 底部提示文本 — 极简 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-4 text-xs text-muted-foreground text-center"
      >
        {isDrawing ? t("stopHint") : t("startHint")}
      </motion.p>
    </motion.div>
  );
}
