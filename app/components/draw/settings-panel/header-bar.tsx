// components/draw/settings-panel/header-bar.tsx —— 顶部标题栏（使用中央翻译系统）
"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createTranslator } from "@/lib/i18n";

export function HeaderBar({ language, onLanguageToggle }: {
  language: "zh" | "en";
  onLanguageToggle: () => void;
}) {
  const t = React.useMemo(() => createTranslator(language), [language]);
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="absolute top-4 left-4 lg:left-8 flex items-center gap-3 z-40"
    >
      <div className="w-10 h-10 bg-foreground/90 rounded-xl flex items-center justify-center shadow-sm">
        <span className="text-background font-bold text-sm">抽</span>
      </div>
      <div>
        <h1 className="text-base font-semibold tracking-tight leading-none">{t("appTitle")}</h1>
        <span className="text-[10px] text-muted-foreground/60 font-mono">v3.3.0</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onLanguageToggle}
        aria-label={t("switchLang")}
        title={t("switchLang")}
        className="rounded-xl hover:bg-muted/60 transition-colors ml-2"
      >
        <Languages className="w-5 h-5" aria-hidden="true" />
      </Button>
    </motion.div>
  );
}
