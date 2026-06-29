// components/draw/history-list/history-card.tsx v3.3.0 —— 历史记录卡片
"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { createTranslator } from "@/lib/i18n";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatTime(iso: string, lang: "zh" | "en"): string {
  try {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);

    if (typeof Intl?.RelativeTimeFormat !== "undefined") {
      const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
      if (diffMin < 1) return rtf.format(0, "minute");
      if (diffMin < 60) return rtf.format(-diffMin, "minute");
      const diffHr = Math.floor(diffMin / 60);
      if (diffHr < 24) return rtf.format(-diffHr, "hour");
    }

    return date.toLocaleString(lang === "zh" ? "zh-CN" : "en-US", {
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
  const t = React.useMemo(() => createTranslator(language), [language]);

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
      aria-label={t("recordLabel", String(entry.results.length), formatTime(entry.timestamp, language))}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs text-muted-foreground font-medium tracking-wide">
          {formatTime(entry.timestamp, language)} · {t("resultsCount", String(entry.results.length))}
        </div>
        <button
          onClick={handleCopy}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-lg",
            "text-xs text-muted-foreground hover:text-foreground hover:bg-background/80",
            "transition-all duration-200 opacity-70 group-hover:opacity-100",
            copied && "text-green-600"
          )}
          aria-label={copied ? t("copiedToClipboard") : t("copyResult")}
        >
          {copied ? (
            <Check className="w-3.5 h-3.5" aria-hidden="true" />
          ) : (
            <Copy className="w-3.5 h-3.5" aria-hidden="true" />
          )}
          <span>{copied ? t("copied") : t("copyResult")}</span>
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
