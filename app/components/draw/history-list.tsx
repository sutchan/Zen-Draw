// components/draw/history-list.tsx v2.1 —— 历史记录列表（中英文支持）
"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Trash2, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

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
// Helpers
// ---------------------------------------------------------------------------

function formatTime(iso: string, lang: "zh" | "en"): string {
  try {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);

    if (lang === "en") {
      if (diffMin < 1) return "just now";
      if (diffMin < 60) return `${diffMin} min ago`;
      const diffHr = Math.floor(diffMin / 60);
      if (diffHr < 24) return `${diffHr} hr ago`;
      return date.toLocaleString("en-US", {
        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
      });
    }

    if (diffMin < 1) return "刚刚";
    if (diffMin < 60) return `${diffMin} 分钟前`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr} 小时前`;
    return date.toLocaleString("zh-CN", {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    });
  } catch {
    return "";
  }
}

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------

interface HistoryCardProps {
  entry: HistoryEntry;
  index: number;
  total: number;
  language: "zh" | "en";
}

function HistoryCard({ entry, index, language }: HistoryCardProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = entry.results.join(", ");
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(
        () => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        },
        () => {
          // 静默失败
        }
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24, delay: index * 0.03 }}
      className={cn(
        "group p-5 rounded-2xl bg-muted/15 hover:bg-muted/30 transition-all duration-300",
        "border border-transparent hover:border-border/30",
        "cursor-pointer shadow-sm hover:shadow-md"
      )}
      onClick={handleCopy}
      role="article"
      aria-label={language === "zh" ? `历史记录：${entry.results.length} 个结果，${formatTime(entry.timestamp, language)}` : `Record: ${entry.results.length} results, ${formatTime(entry.timestamp, language)}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs text-muted-foreground font-medium tracking-wide">
          {formatTime(entry.timestamp, language)} · {language === "zh" ? `共 ${entry.results.length} 项` : `${entry.results.length} items`}
        </div>
        <button
          onClick={handleCopy}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-lg",
            "text-xs text-muted-foreground hover:text-foreground hover:bg-background/80",
            "transition-all duration-200 opacity-70 group-hover:opacity-100",
            copied && "text-green-600"
          )}
          aria-label={copied ? (language === "zh" ? "已复制到剪贴板" : "Copied to clipboard") : (language === "zh" ? "复制结果到剪贴板" : "Copy results to clipboard")}
        >
          {copied ? (
            <Check className="w-3.5 h-3.5" aria-hidden="true" />
          ) : (
            <Copy className="w-3.5 h-3.5" aria-hidden="true" />
          )}
          <span>{copied ? (language === "zh" ? "已复制" : "Copied") : (language === "zh" ? "复制" : "Copy")}</span>
        </button>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {entry.results.map((res, idx) => (
          <span
            key={`${entry.id}-${idx}-${res}`}
            className="inline-flex items-center justify-center px-3.5 py-2 rounded-xl bg-background/80 shadow-sm text-base font-semibold border border-border/20 backdrop-blur-sm tabular-nums"
          >
            {res}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Empty State
// ---------------------------------------------------------------------------

function EmptyState({ language }: { language: "zh" | "en" }) {
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

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function HistoryList({ history, onClear, language = "zh" }: HistoryListProps) {
  const hasHistory = history.length > 0;
  const isZH = language === "zh";

  return (
    <div className="space-y-4" role="region" aria-label={isZH ? "历史记录" : "History"}>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-lg font-semibold tracking-tight">
            {isZH ? "历史记录" : "History"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {hasHistory
              ? isZH
                ? `共 ${history.length} 条记录（最多保存 100 条）`
                : `${history.length} records (max 100)`
              : isZH
              ? "点击任意记录可复制结果"
              : "Click any record to copy"}
          </p>
        </div>
        {hasHistory && (
          <button
            onClick={onClear}
            aria-label={isZH ? "清空历史记录" : "Clear history"}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg",
              "text-sm text-muted-foreground hover:text-red-600 hover:bg-red-500/10",
              "transition-all duration-200"
            )}
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
            <span>{isZH ? "清空" : "Clear"}</span>
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
              <HistoryCard key={entry.id} entry={entry} index={idx} total={history.length} language={language} />
            ))}
          </motion.div>
        ) : (
          <EmptyState language={language} />
        )}
      </div>
    </div>
  );
}
