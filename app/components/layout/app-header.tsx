// components/layout/app-header.tsx v5.1 —— 顶部导航栏（Logo + 主题切换 + 设置面板）
"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Sun, Moon, Settings2, Sparkles } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SettingsPanel } from "@/components/draw/settings-panel";
import { createTranslator } from "@/lib/i18n";
import type { UseDrawReturn } from "@/hooks/draw-types";

export interface AppHeaderProps {
  draw: UseDrawReturn;
  panelOpen: boolean;
  onPanelOpenChange: (open: boolean) => void;
  theme: string | undefined;
  onThemeToggle: () => void;
  shouldReduceMotion: boolean | null;
}

export function AppHeader({
  draw,
  panelOpen,
  onPanelOpenChange,
  theme,
  onThemeToggle,
  shouldReduceMotion,
}: AppHeaderProps) {
  const lang = draw.language;
  const t = React.useMemo(() => createTranslator(lang), [lang]);

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b border-border/50">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <motion.div
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

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={onThemeToggle}
            aria-label={theme === "dark" ? t("switchLight") : t("switchDark")}
            className="rounded-full"
          >
            {theme === "dark" ? (
              <Sun className="size-4" aria-hidden="true" />
            ) : (
              <Moon className="size-4" aria-hidden="true" />
            )}
          </Button>

          <Sheet open={panelOpen} onOpenChange={onPanelOpenChange}>
            <SheetTrigger
              className="inline-flex items-center justify-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={t("settings")}
            >
              <Settings2 className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">{t("settings")}</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[420px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-lg">{t("settings")}</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <SettingsPanel
                  min={draw.min}
                  max={draw.max}
                  count={draw.count}
                  duration={draw.duration}
                  allowDuplicates={draw.allowDuplicates}
                  autoHide={draw.autoHide}
                  customList={draw.customList}
                  useCustomList={draw.useCustomList}
                  digits={draw.digits}
                  prefix={draw.prefix}
                  suffix={draw.suffix}
                  open={panelOpen}
                  onToggle={() => onPanelOpenChange(!panelOpen)}
                  onMinChange={draw.setMin}
                  onMaxChange={draw.setMax}
                  onCountChange={draw.setCount}
                  onDurationChange={draw.setDuration}
                  onAllowDuplicatesChange={draw.setAllowDuplicates}
                  onAutoHideChange={draw.setAutoHide}
                  onCustomListChange={draw.setCustomList}
                  onUseCustomListChange={draw.setUseCustomList}
                  onDigitsChange={draw.setDigits}
                  onPrefixChange={draw.setPrefix}
                  onSuffixChange={draw.setSuffix}
                  language={lang}
                  onLanguageToggle={() =>
                    draw.setLanguage(lang === "zh" ? "en" : "zh")
                  }
                  history={draw.history}
                  onClearHistory={draw.clearHistory}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
