// components/draw/history-list/empty-state.tsx —— 空状态显示
"use client";

import * as React from "react";
import { motion } from "motion/react";

export function EmptyState({ language }: { language: "zh" | "en" }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="py-16 text-center border-2 border-dashed border-border/20 rounded-2xl bg-muted/10"
    >
      <div className="text-muted-foreground text-base font-medium mb-2">
        {language === "zh" ? "暂无历史记录" : "No history yet"}
      </div>
      <div className="text-sm text-muted-foreground/70">
        {language === "zh" ? "抽取结果会自动保存在这里" : "Draw results are saved here automatically"}
      </div>
    </motion.div>
  );
}
