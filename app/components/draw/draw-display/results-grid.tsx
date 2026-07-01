// components/draw/draw-display/results-grid.tsx v3.3.0 —— 所有结果网格
"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { createTranslator } from "@/lib/i18n";
import { CelebrationEffect } from "./celebration-effect";
import { ResultCard } from "./result-card";

export function ResultsGrid({
  results,
  isDrawing,
  language,
}: {
  results: string[];
  isDrawing: boolean;
  language: "zh" | "en";
}) {
  // 检测是否刚从滚动状态变为结果状态（揭晓时刻）
  const [celebrating, setCelebrating] = React.useState(false);
  const prevDrawingRef = React.useRef(isDrawing);
  const t = React.useMemo(() => createTranslator(language), [language]);

  React.useEffect(() => {
    if (prevDrawingRef.current && !isDrawing) {
      // 刚刚揭晓结果 → 触发庆祝效果
      setCelebrating(true);
      const timer = window.setTimeout(() => setCelebrating(false), 1200);
      prevDrawingRef.current = isDrawing;
      return () => window.clearTimeout(timer);
    }
    prevDrawingRef.current = isDrawing;
    return;
  }, [isDrawing]);

  return (
    <div
      className="w-full relative"
      role="region"
      aria-live="assertive"
      aria-label={t("resultRegion")}
    >
      {/* 庆祝光晕（结果揭晓时短暂显示） */}
      <CelebrationEffect active={celebrating} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div
          className={cn(
            "flex flex-wrap justify-center items-center",
            results.length === 1 ? "gap-0" : "gap-6 sm:gap-10"
          )}
        >
          {results.map((result, idx) => (
            <ResultCard
              key={idx + "-" + result}
              value={result}
              isDrawing={isDrawing}
              index={idx}
              language={language}
              celebrating={celebrating}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
