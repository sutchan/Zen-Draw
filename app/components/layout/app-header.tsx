// components/layout/app-header.tsx v5.7.7 —— 顶部导航栏（Logo + 设置面板）
"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Settings2, Sparkles, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { SettingsPanel } from "@/components/draw/settings-panel";
import { createTranslator } from "@/lib/i18n";
import type { UseDrawReturn } from "@/hooks/draw-types";

export interface AppHeaderProps {
  draw: UseDrawReturn;
  panelOpen: boolean;
  onPanelOpenChange: (open: boolean) => void;
  shouldReduceMotion: boolean | null;
}

export function AppHeader({
  draw,
  panelOpen,
  onPanelOpenChange,
  shouldReduceMotion,
}: AppHeaderProps) {
  const lang = draw.language;
  const t = React.useMemo(() => createTranslator(lang), [lang]);

  return (
    <header id="app-header" className="sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b border-border/50">
      <div id="header-content" className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <motion.div
          id="header-brand"
          initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2.5"
        >
          <div className="size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
            <Sparkles className="size-5" aria-hidden="true" />
          </div>
          <div>
            <div className="text-base font-semibold leading-tight">
              {t("appTitle")}
            </div>
            <div className="text-xs text-muted-foreground">
              {t("appSubtitle")}
            </div>
          </div>
        </motion.div>

        <div id="header-actions" className="flex items-center gap-1.5">
          <Sheet open={panelOpen} onOpenChange={onPanelOpenChange}>
            <SheetTrigger
              className="inline-flex items-center justify-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={t("settings")}
              data-testid="settings-trigger"
            >
              <Settings2 className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">{t("settings")}</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[420px]">
              <SheetHeader className="flex-row items-center justify-between space-y-0 shrink-0">
                <SheetTitle className="text-lg">{t("settings")}</SheetTitle>
                <SheetClose
                  aria-label={t("close")}
                  className="static ml-auto rounded-full p-2 opacity-100 hover:bg-accent transition-colors"
                >
                  <X className="size-4" aria-hidden="true" />
                </SheetClose>
              </SheetHeader>
              <SettingsPanel
                {...draw}
                language={lang}
                onLanguageToggle={() =>
                  draw.setLanguage(lang === "zh" ? "en" : "zh")
                }
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

