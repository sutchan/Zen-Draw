// components/draw/draw-display/result-card.tsx —— 单个结果卡片
"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { NumberRoller } from "@/components/number-roller";
import { createTranslator } from "@/lib/i18n";

export function ResultCard({
  value,
  isDrawing,
  index,
  language,
  celebrating,
}: {
  value: string;
  isDrawing: boolean;
  index: number;
  language: "zh" | "en";
  celebrating: boolean;
}) {
  const t = React.useMemo(() => createTranslator(language), [language]);
  const label = t("resultLabel", String(index + 1), value);

  return (
    <motion.div
      key={value + index}
      initial={{ opacity: 0, y: 30, scale: 0.85 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: celebrating ? [1, 1.025, 1] : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 25,
        mass: 0.9,
        delay: isDrawing ? index * 0.02 : index * 0.08,
      }}
      className="flex items-center justify-center"
      role="article"
      aria-label={label}
    >
      <motion.div
        className={cn(
          "bg-background border rounded-[calc(var(--radius)*3.33)] min-w-[220px] sm:min-w-[300px] px-10 py-8 sm:px-16 sm:py-12 text-center",
          "border-border/20",
          isDrawing && "scale-[1.02]"
        )}
        animate={{
          boxShadow: celebrating
            ? [
                "0 8px 32px rgba(0,0,0,0.06)",
                "0 8px 48px hsl(var(--primary) / 0.2)",
                "0 8px 32px rgba(0,0,0,0.06)",
              ]
            : "0 8px 32px rgba(0,0,0,0.06)",
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <NumberRoller
          value={value}
          isDrawing={isDrawing}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-[12vw] font-bold tracking-tighter tabular-nums leading-none"
        />
      </motion.div>
    </motion.div>
  );
}
