// components/draw/draw-display/index.tsx v3.3.0 —— 主显示区（统一 draw 对象 + 增强 ARIA）
"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { createTranslator } from "@/lib/i18n";
import { WelcomeScreen } from "./welcome-screen";
import { ErrorScreen } from "./error-screen";
import { ResultsGrid } from "./results-grid";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

// 最小所需的 draw 接口（允许传入完整 UseDrawReturn）
type DrawLike = {
  results: string[];
  status: "idle" | "drawing" | "result" | "error";
  language: "zh" | "en";
};

export interface DrawDisplayProps {
  draw: DrawLike;
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function DrawDisplay({ draw }: DrawDisplayProps) {
  const shouldReduceMotion = useReducedMotion();
  const { results, status, language } = draw;
  const isDrawing = status === "drawing";
  const t = React.useMemo(() => createTranslator(language), [language]);

  return (
    <motion.div
      role="region"
      aria-label={t("drawDisplayArea")}
      className="flex-1 flex flex-col items-center justify-center relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
    >
      {/* 结果显示区（居中） */}
      <div
        className={cn(
          "flex-1 flex flex-col items-center justify-center w-full max-w-5xl",
          "px-6 sm:px-8 md:px-12 py-4 sm:py-8"
        )}
      >
        <AnimatePresence mode="wait">
          {status === "error" ? (
            <div
              key="error"
              className="flex-1 flex items-center justify-center"
            >
              <ErrorScreen language={language} />
            </div>
          ) : results.length === 0 ? (
            <div
              key="welcome"
              className="flex-1 flex items-center justify-center"
            >
              <WelcomeScreen language={language} />
            </div>
          ) : (
            <div key="results" className="flex-1 flex items-center justify-center">
              <ResultsGrid
                results={results}
                isDrawing={isDrawing}
                language={language}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
