// components/draw/history-list/empty-state.tsx v5.7.7 —— 愉悦空状态（浮动骰子 + 俏皮文案）
"use client";

import * as React from "react";
import { motion } from "motion/react";
import { useMountedReducedMotion } from "@/hooks/use-mounted-reduced-motion";
import { Dices } from "lucide-react";
import { createTranslator } from "@/lib/i18n";

export function EmptyState({ language }: { language: "zh" | "en" }) {
  const t = React.useMemo(() => createTranslator(language), [language]);
  const shouldReduceMotion = useMountedReducedMotion();

  return (
    <motion.div
      id="history-empty-state"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="py-16 text-center rounded-2xl border-2 border-dashed border-border/20 bg-muted/10"
    >
      {/* 轻轻浮动的骰子 */}
      <motion.div
        {...(shouldReduceMotion
          ? {}
          : {
              animate: { y: [0, -10, 0], rotate: [0, -6, 6, 0] },
              transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut" as const,
              },
            })}
        aria-hidden="true"
        className="mb-6 flex justify-center"
      >
        <Dices
          className="text-primary/30"
          style={{ width: "4.5rem", height: "4.5rem" }}
        />
      </motion.div>

      <div className="text-muted-foreground text-base font-medium mb-2">
        {t("noHistory")}
      </div>
      <div className="text-sm text-muted-foreground/70 mb-3">
        {t("emptyStateHint")}
      </div>
      <div className="text-xs text-muted-foreground/50">
        {t("autoSaveDesc")}
      </div>
    </motion.div>
  );
}

