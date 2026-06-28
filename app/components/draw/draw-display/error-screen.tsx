// components/draw/draw-display/error-screen.tsx —— 错误状态显示
"use client";

import * as React from "react";
import { motion } from "motion/react";
import { AlertTriangle } from "lucide-react";
import { createTranslator } from "@/lib/i18n";

export function ErrorScreen({ language }: { language: "zh" | "en" }) {
  const t = React.useMemo(() => createTranslator(language), [language]);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col items-center justify-center text-center"
      role="alert"
      aria-live="assertive"
    >
      <AlertTriangle
        className="text-destructive/40 mb-8"
        style={{ width: "8rem", height: "8rem" }}
        aria-hidden="true"
      />
      <div className="space-y-3">
        <p className="text-3xl md:text-4xl text-destructive font-semibold tracking-tight">
          {t("errorTitle")}
        </p>
        <p className="text-base text-muted-foreground/70 max-w-md">
          {t("errorMessage")}
        </p>
      </div>
    </motion.div>
  );
}
