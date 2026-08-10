// components/draw/draw-display/results-grid.tsx v5.7.3 —— 所有结果网格（惊艳升级：彩屑+揭晓标题+里程碑）
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { createTranslator } from "@/lib/i18n";
import { CelebrationEffect } from "./celebration-effect";
import { ConfettiBurst } from "./confetti-burst";
import { ResultCard } from "./result-card";

export function ResultsGrid({
  results,
  isDrawing,
  language,
  density,
  confettiEnabled,
  reduceMotion,
}: {
  results: string[];
  isDrawing: boolean;
  language: "zh" | "en";
  density: "comfortable" | "compact";
  confettiEnabled: boolean;
  reduceMotion: boolean;
}) {
  // 检测是否刚从滚动状态变为结果状态（揭晓时刻）
  const [celebrating, setCelebrating] = React.useState(false);
  // 里程碑：会话内抽签计数 & 当前成就数字
  const drawCountRef = React.useRef(0);
  const [milestone, setMilestone] = React.useState<number | null>(null);

  const prevDrawingRef = React.useRef(isDrawing);
  const shouldReduceMotion = reduceMotion;
  const t = React.useMemo(() => createTranslator(language), [language]);

  React.useEffect(() => {
    if (prevDrawingRef.current && !isDrawing) {
      // 刚刚揭晓结果 → 触发庆祝效果
      setCelebrating(true);
      const timer = window.setTimeout(() => setCelebrating(false), 1400);

      // 会话内抽签计数 + 里程碑成就
      drawCountRef.current += 1;
      const count = drawCountRef.current;
      if (count === 1 || count % 10 === 0) {
        setMilestone(count);
        const mTimer = window.setTimeout(() => setMilestone(null), 2800);
        prevDrawingRef.current = isDrawing;
        return () => {
          window.clearTimeout(timer);
          window.clearTimeout(mTimer);
        };
      }

      prevDrawingRef.current = isDrawing;
      return () => window.clearTimeout(timer);
    }
    prevDrawingRef.current = isDrawing;
    return;
  }, [isDrawing]);

  return (
    <div
      id="results-region"
      className="w-full relative"
      role="region"
      aria-live="assertive"
      aria-label={t("resultRegion")}
    >
      {/* 庆祝光晕（结果揭晓时短暂显示） */}
      <CelebrationEffect active={confettiEnabled && celebrating} />

      {/* 🎉 彩屑爆发（惊艳核心） */}
      <ConfettiBurst active={confettiEnabled && celebrating} />

      {/* ✨ 揭晓标题：随揭晓弹出，轻淡出 */}
      <AnimatePresence>
        {celebrating && (
          <motion.p
            key="reveal-title"
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -12, scale: 0.8 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.45,
              ease: [0.34, 1.56, 0.64, 1], // 轻微回弹
            }}
            className="pointer-events-none absolute left-1/2 top-[6%] z-30 -translate-x-1/2 text-center text-base font-semibold tracking-wide text-foreground/70"
            aria-hidden="true"
          >
            {t("revealTitle")}
          </motion.p>
        )}
      </AnimatePresence>

      {/* 🏆 里程碑徽章：第 1/10/20… 次抽签 */}
      <AnimatePresence>
        {milestone !== null && (
          <motion.div
            key="milestone"
            initial={
              shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.5,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className="pointer-events-none absolute right-[6%] top-[8%] z-30 origin-top-right whitespace-nowrap rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm"
            aria-hidden="true"
          >
            {t("milestoneDraws", String(milestone))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        id="result-cards"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
          <div
            id="result-cards-grid"
            className={[
              "flex flex-wrap justify-center items-center",
              results.length === 1
                ? "gap-0"
                : density === "compact"
                  ? "gap-3 sm:gap-5"
                  : "gap-6 sm:gap-10",
            ].join(" ")}
          >
            {results.map((result, idx) => (
              <ResultCard
                key={idx + "-" + result}
                value={result}
                isDrawing={isDrawing}
                index={idx}
                language={language}
                celebrating={celebrating}
                density={density}
              />
            ))}
          </div>
      </motion.div>
    </div>
  );
}

