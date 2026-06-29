// components/draw/history-list/empty-state.tsx v3.3.0 —— 空状态显示（使用中央翻译系统）
"use client";

import * as React from "react";
import { motion } from "motion/react";
import { createTranslator } from "@/lib/i18n";

export function EmptyState({ language }: { language: "zh" | "en" }) {
  const t = React.useMemo(() => createTranslator(language), [language]);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="py-16 text-center border-2 border-dashed border-border/20 rounded-2xl bg-muted/10"
    >
      <div className="text-muted-foreground text-base font-medium mb-2">
        {t("noHistory")}
      </div>
      <div className="text-sm text-muted-foreground/70">
        {t("autoSaveDesc")}
      </div>
    </motion.div>
  );
}
