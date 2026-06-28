// components/draw/settings-panel/header-bar.tsx —— 顶部标题栏
"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeaderBar({ t, language, onLanguageToggle }: {
  t: { title: string; version: string };
  language: "zh" | "en";
  onLanguageToggle: () => void;
}) {
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
        <h1 className="text-base font-semibold tracking-tight leading-none">{t.title}</h1>
        <span className="text-[10px] text-muted-foreground/60 font-mono">{t.version}</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onLanguageToggle}
        aria-label="切换语言"
        title="切换语言"
        className="rounded-xl hover:bg-muted/60 transition-colors ml-2"
      >
        <Languages className="w-5 h-5" aria-hidden="true" />
      </Button>
    </motion.div>
  );
}
