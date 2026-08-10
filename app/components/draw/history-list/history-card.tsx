// components/draw/history-list/history-card.tsx v5.7.5 —— 历史记录卡片
"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { createTranslator } from "@/lib/i18n";
import { useToast } from "@/components/ui/toast";

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
  const toast = useToast();

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = entry.results.join(", ");
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(
        () => {
          setCopied(true);
          toast(t("copiedToClipboard"), { type: "success" });
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
      id={`history-card-${index}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24, delay: index * 0.03 }}
      className={cn(
        "group p-5 rounded-2xl bg-muted/15 hover:bg-muted/30 transition-all duration-300",
        "border border-transparent hover:border-border/30",
        "shadow-sm hover:shadow-md"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1 flex items-center gap-2 truncate">
          <span className="shrink-0 text-xs text-muted-foreground font-medium tracking-wide">
            {formatTime(entry.timestamp, language)}
          </span>
          <span className="truncate text-lg sm:text-xl font-bold tabular-nums tracking-tight">
            {entry.results.join(", ")}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className={cn(
            "shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg",
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
    </motion.div>
  );
}

