// app/error.tsx v5.0.0 — 全局错误边界（i18n + digest + lucide + reduce-motion）
"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { createTranslator } from "@/lib/i18n";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const language = useLanguage();
  const t = createTranslator(language);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    console.error("ZenDraw Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10"
      >
        <AlertCircle className="h-8 w-8 text-destructive" aria-hidden="true" />
      </motion.div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{t("errorPageTitle")}</h1>
        <p className="text-muted-foreground text-sm max-w-md">{t("errorPageDesc")}</p>
      </div>

      {error.digest ? (
        <p className="text-xs text-muted-foreground/70 font-mono">
          {t("errorIdLabel")}: {error.digest}
        </p>
      ) : null}

      <div className="flex gap-3">
        <Button onClick={reset} variant="default" className="rounded-full">
          <RefreshCw className="size-4" aria-hidden="true" />
          {t("errorRetry")}
        </Button>
        <Button
          onClick={() => {
            window.location.href = "/";
          }}
          variant="outline"
          className="rounded-full"
        >
          <Home className="size-4" aria-hidden="true" />
          {t("errorBackHome")}
        </Button>
      </div>
    </div>
  );
}
