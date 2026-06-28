// components/draw/history-list/history-card.tsx —— 历史记录卡片
"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

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
// Component
// ---------------------------------------------------------------------------

export function HistoryCard({
  entry,
  index,
  language,
}: {
  entry: { id: string; timestamp: string; results: string[] };
  index: number;
  language: "zh" | "en";
}) {
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
      role="button"
      tabIndex={0}
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
