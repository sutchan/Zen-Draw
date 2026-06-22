// components/draw/draw-display.tsx v2.0 —— 主显示区（欢迎状态 + 结果显示）
"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Dices } from "lucide-react";
import { cn } from "@/lib/utils";
import { NumberRoller } from "@/components/number-roller";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface DrawDisplayProps {
  results: string[];
  isDrawing: boolean;
  showUI: boolean;
  onToggleUI: () => void;
}

// ---------------------------------------------------------------------------
// Sub-component: Welcome Screen (空闲状态显示)
// ---------------------------------------------------------------------------

function WelcomeScreen({ t }: { t: { ready: string; hint: string } }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col items-center justify-center text-center"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        aria-hidden="true"
      >
        <Dices
          className="text-muted-foreground/20 mb-8"
          style={{ width: "10rem", height: "10rem" }}
          aria-hidden="true"
        />
      </motion.div>
      <div className="space-y-3">
        <p className="text-5xl md:text-6xl lg:text-7xl text-foreground/85 font-semibold tracking-tight leading-tight">
          {t.ready}
        </p>
        <p className="text-base md:text-lg text-muted-foreground/60">{t.hint}</p>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: Result Card (单个结果卡片)
// ---------------------------------------------------------------------------

function ResultCard({ value, isDrawing, index }: { value: string; isDrawing: boolean; index: number }) {
  return (
    <motion.div
      key={value + index}
      initial={{ opacity: 0, y: 30, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 25,
        mass: 0.9,
        delay: isDrawing ? index * 0.02 : index * 0.08,
      }}
      className="flex items-center justify-center"
      aria-label={`结果 ${index + 1}: ${value}`}
    >
      <div
        className={cn(
          "bg-background border rounded-[2.5rem] min-w-[220px] sm:min-w-[300px] px-10 py-8 sm:px-16 sm:py-12 text-center transition-all duration-500",
          // 基础边框与阴影（视觉层次提升）
          "border-border/20 shadow-[0_8px_32px_rgba(0,0,0,0.06)]",
          // 滚动时的脉冲动画效果
          isDrawing && "scale-[1.02] shadow-[0_12px_40px_rgba(0,0,0,0.10)]"
        )}
      >
        <NumberRoller
          value={value}
          isDrawing={isDrawing}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-[12vw] font-bold tracking-tighter tabular-nums leading-none"
        />
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: Result Grid (所有结果)
// ---------------------------------------------------------------------------

function ResultsGrid({ results, isDrawing }: { results: string[]; isDrawing: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full"
      aria-live="polite"
      aria-label="抽取结果"
    >
      <div
        className={cn(
          "flex flex-wrap justify-center items-center",
          // 动态间距：单结果更大，多结果更紧凑
          results.length === 1 ? "gap-0" : "gap-6 sm:gap-10"
        )}
      >
        {results.map((result, idx) => (
          <ResultCard key={idx + result} value={result} isDrawing={isDrawing} index={idx} />
        ))}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function DrawDisplay({ results, isDrawing, showUI, onToggleUI }: DrawDisplayProps) {
  const shouldReduceMotion = useReducedMotion();

  // 点击空白区切换 UI（移动端优化）
  const handleContainerClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && showUI) onToggleUI();
  };

  return (
    <motion.div
      role="main"
      aria-label="抽取结果主显示区"
      className="flex-1 flex flex-col items-center justify-center relative pt-14"
      onClick={handleContainerClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
    >
      {/* 结果显示区（居中） */}
      <div
        className={cn(
          "flex-1 flex flex-col items-center justify-center w-full max-w-5xl",
          "px-6 sm:px-8 md:px-12 py-12 sm:py-16"
        )}
      >
        <AnimatePresence mode="wait">
          {results.length === 0 ? (
            <div key="welcome" className="flex-1 flex items-center justify-center">
              <WelcomeScreen
                t={{
                  ready: "准备就绪",
                  hint: "点击下方按钮开始抽取",
                }}
              />
            </div>
          ) : (
            <ResultsGrid results={results} isDrawing={isDrawing} />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
