// page.tsx v5.0 —— 抽取主页面（极简设计优化）
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
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useDraw } from "@/hooks/use-draw";
import { useSound } from "@/hooks/use-sound";
import { DrawButton } from "@/components/draw/draw-button";
import { SettingsPanel } from "@/components/draw/settings-panel";
import { HistoryList } from "@/components/draw/history-list";
import { DrawDisplay } from "@/components/draw/draw-display";
import { createTranslator } from "@/lib/i18n";
export default function HomePage() {
  const shouldReduceMotion = useReducedMotion();
  const { theme, setTheme } = useTheme();

  // 1. 统一状态管理
  const { play } = useSound();
  const draw = useDraw(play);

  // 2. 面板状态
  const [panelOpen, setPanelOpen] = React.useState(false);
  const t = React.useMemo(() => createTranslator(draw.language), [draw.language]);

  // 3. 键盘快捷键
  const drawRef = React.useRef(draw);
  React.useEffect(() => {
    drawRef.current = draw;
  }, [draw]);

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

      if (e.key === " " && !isTyping && !panelOpen && target?.tagName !== "BUTTON") {
        e.preventDefault();
        const currentDraw = drawRef.current;
        if (currentDraw.status === "drawing") currentDraw.stopDraw();
        else if (currentDraw.canDraw) currentDraw.startDraw();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [panelOpen]);

  const lang = draw.language;

  return (
    <div
      className="min-h-screen w-full bg-background text-foreground antialiased"
      role="application"
      aria-label={t("appTitle")}
    >
      {/* Header — 极简设计 */}
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
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={
                theme === "dark"
                  ? t("switchLight")
                  : t("switchDark")
              }
              className="rounded-full"
            >
              {theme === "dark" ? (
                <Sun className="size-4" aria-hidden="true" />
              ) : (
                <Moon className="size-4" aria-hidden="true" />
              )}
            </Button>

            <Sheet open={panelOpen} onOpenChange={setPanelOpen}>
              <SheetTrigger
                className="inline-flex items-center justify-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={t("settings")}
              >
                <Settings2 className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">{t("settings")}</span>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full sm:w-[420px] overflow-y-auto"
              >
                <SheetHeader>
                  <SheetTitle className="text-lg">
                    {t("settings")}
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
                    history={draw.history}
                    onClearHistory={draw.clearHistory}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content — 极简布局 */}
      <main className="mx-auto max-w-6xl px-4 pt-8 sm:pt-12 pb-16">
        <section aria-label={t("drawMainArea")} className="flex flex-col items-center">
          <DrawDisplay draw={draw} />

          <div className="mt-8 sm:mt-12">
            <DrawButton
              isDrawing={draw.status === "drawing"}
              onStart={draw.startDraw}
              onStop={draw.stopDraw}
              canDraw={draw.canDraw}
              language={lang}
            />
          </div>
        </section>

        <section className="mt-12 sm:mt-16 max-w-2xl mx-auto">
          <HistoryList history={draw.history} language={lang} onClear={draw.clearHistory} onSetHistory={draw.setHistory} />
        </section>
      </main>

      {/* Footer — 极简 */}
      <footer className="py-6 text-center text-xs text-muted-foreground/70 border-t border-border/30">
        <p>
          {t("footerInfo", String(10), String(6))}
        </p>
      </footer>
    </div>
  );
}
