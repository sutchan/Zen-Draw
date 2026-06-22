// page.tsx v2.1 —— 抽取主页面（架构重构 + 完整键盘与 ARIA）
"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Sun, Moon, Settings2, Sparkles } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { THEME_PRESETS, FONT_FAMILIES } from "@/components/theme-provider";
import { useDraw } from "@/hooks/use-draw";
import { NumberRoller } from "@/components/number-roller";
import { DrawButton } from "@/components/draw/draw-button";
import { SettingsPanel } from "@/components/draw/settings-panel";
import { HistoryList } from "@/components/draw/history-list";
import { DrawDisplay } from "@/components/draw/draw-display";

export default function HomePage() {
  const shouldReduceMotion = useReducedMotion();
  const { theme, setTheme } = useTheme();

  // 1. 统一状态管理
  const draw = useDraw();

  // 2. 面板状态
  const [panelOpen, setPanelOpen] = React.useState(false);

  // 3. 键盘快捷键
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (e.key === "Escape") {
        if (panelOpen) {
          setPanelOpen(false);
          e.preventDefault();
        }
        return;
      }

      if (e.key === " " && !isTyping && !panelOpen) {
        e.preventDefault();
        if (draw.status === "drawing") draw.stopDraw();
        else if (draw.canDraw) draw.startDraw();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [panelOpen, draw]);

  const lang = draw.language;
  const isZH = lang === "zh";

  return (
    <div
      className="min-h-screen w-full bg-gradient-to-b from-background via-background to-background/95 text-foreground antialiased"
      role="application"
      aria-label={isZH ? "随机抽取应用" : "Random Draw Application"}
    >
      <header className="sticky top-0 z-30 backdrop-blur-sm bg-background/70 border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2"
          >
            <div className="size-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md">
              <Sparkles className="size-5" aria-hidden="true" />
            </div>
            <div>
              <div className="text-lg font-semibold leading-none">
                {isZH ? "真随机" : "ZenDraw"}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {isZH ? "真随机抽取工具" : "Truly random draw tool"}
              </div>
            </div>
          </motion.div>

          <div className="flex items-center gap-2">
            <Sheet open={panelOpen} onOpenChange={setPanelOpen}>
              <SheetTrigger
                className="inline-flex items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={isZH ? "打开设置" : "Open settings"}
              >
                <Settings2 className="size-4" aria-hidden="true" />
                {isZH ? "设置" : "Settings"}
              </SheetTrigger>
              <SheetContent
                side="right"
                size="lg"
                className="w-full sm:w-[420px] overflow-y-auto"
              >
                <SheetHeader>
                  <SheetTitle className="text-lg">
                    {isZH ? "设置" : "Settings"}
                  </SheetTitle>
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
                    onToggle={() => setPanelOpen((p) => !p)}
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
                  />
                </div>
              </SheetContent>
            </Sheet>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={
                theme === "dark"
                  ? isZH
                    ? "切换到浅色模式"
                    : "Switch to light mode"
                  : isZH
                  ? "切换到深色模式"
                  : "Switch to dark mode"
              }
            >
              {theme === "dark" ? (
                <Sun className="size-4" aria-hidden="true" />
              ) : (
                <Moon className="size-4" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-10 sm:pt-14">
        <section aria-label={isZH ? "抽取主区域" : "Draw main area"}>
          <DrawDisplay draw={draw} />

          <DrawButton
            isDrawing={draw.status === "drawing"}
            onStart={draw.startDraw}
            onStop={draw.stopDraw}
            canDraw={draw.canDraw}
            language={lang}
          />
        </section>

        <HistoryList history={draw.history} language={lang} onClear={draw.clearHistory} onSetHistory={draw.setHistory} />
      </main>

      <footer className="mt-10 py-6 text-center text-xs text-muted-foreground/70">
        <p>
          {isZH
            ? `${THEME_PRESETS.length} 种主题 · ${FONT_FAMILIES.length} 种字体 · 本地存储`
            : `${THEME_PRESETS.length} themes · ${FONT_FAMILIES.length} fonts · stored locally`}
        </p>
      </footer>
    </div>
  );
}
