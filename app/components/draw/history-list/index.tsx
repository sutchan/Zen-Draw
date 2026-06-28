// components/draw/history-list/index.tsx v3.1 —— 历史记录列表（使用中央翻译系统）
"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { HistoryCard } from "./history-card";
import { EmptyState } from "./empty-state";
import { createTranslator } from "@/lib/i18n";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface HistoryEntry {
  id: string;
  timestamp: string;
  results: string[];
}

export interface HistoryListProps {
  history: HistoryEntry[];
  onClear: () => void;
  language?: "zh" | "en";
  onSetHistory?: (updater: (prev: HistoryEntry[]) => HistoryEntry[]) => void;
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function HistoryList({ history, onClear, language = "zh" }: HistoryListProps) {
  const hasHistory = history.length > 0;
  const t = React.useMemo(() => createTranslator(language), [language]);

  return (
    <div className="space-y-4" role="region" aria-label={t("history")}>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-lg font-semibold tracking-tight">
            {t("history")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {hasHistory
              ? `${history.length} ${t("historyDesc")}`
              : language === "zh"
              ? "点击任意记录可复制结果"
              : "Click any record to copy"}
          </p>
        </div>
        {hasHistory && (
          <button
            onClick={onClear}
            aria-label={t("clearHistory")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg",
              "text-sm text-muted-foreground hover:text-red-600 hover:bg-red-500/10",
              "transition-all duration-200"
            )}
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
            <span>{t("clearHistory")}</span>
          </button>
        )}
      </div>

      <div className="space-y-3" aria-live="polite">
        {hasHistory ? (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
            className="space-y-3 max-h-[60vh] overflow-y-auto pr-1"
          >
            {history.map((entry, idx) => (
              <HistoryCard key={entry.id} entry={entry} index={idx} language={language} />
            ))}
          </motion.div>
        ) : (
          <EmptyState language={language} />
        )}
      </div>
    </div>
  );
}
