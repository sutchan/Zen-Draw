// page.tsx v5.7.7 —— 抽取主页面（状态编排 + 键盘快捷键）
"use client";

import * as React from "react";
import { useMountedReducedMotion } from "@/hooks/use-mounted-reduced-motion";
import { useDraw } from "@/hooks/use-draw";
import { useSound } from "@/hooks/use-sound";
import { DrawButton } from "@/components/draw/draw-button";
import { HistoryList } from "@/components/draw/history-list";
import { DrawDisplay } from "@/components/draw/draw-display";
import { AppHeader } from "@/components/layout/app-header";
import { createTranslator } from "@/lib/i18n";
import { APP_VERSION } from "@/lib/version";

export default function HomePage() {
  const shouldReduceMotion = useMountedReducedMotion();

  // 1. 统一状态管理
  const { play } = useSound();
  const draw = useDraw(play);

  // 2. 面板状态
  const [panelOpen, setPanelOpen] = React.useState(false);
  const t = React.useMemo(() => createTranslator(draw.language), [draw.language]);

  // 3. 键盘快捷键（用 ref 避免频繁重绑监听器）
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

  // 自动隐藏面板：开启 autoHide 且处于抽取/结果态时，派生关闭面板（无需副作用 setState）
  const effectivePanelOpen = panelOpen && !(
    draw.autoHide &&
    (draw.status === "drawing" || draw.status === "result")
  );

  return (
    <div
      id="app-shell"
      className="min-h-screen w-full bg-background text-foreground antialiased"
      role="application"
      aria-label={t("appTitle")}
    >
      <AppHeader
        draw={draw}
        panelOpen={effectivePanelOpen}
        onPanelOpenChange={setPanelOpen}
        shouldReduceMotion={shouldReduceMotion}
      />

      {/* Main Content — 极简布局 */}
      <main id="app-main" className="mx-auto max-w-6xl px-4 pt-8 sm:pt-12 pb-16">
        <section id="draw-area" aria-label={t("drawMainArea")} className="flex flex-col items-center">
          <DrawDisplay draw={draw} />

          <div id="action-area" className="mt-8 sm:mt-12">
            <DrawButton
              isDrawing={draw.status === "drawing"}
              onStart={draw.startDraw}
              onStop={draw.stopDraw}
              canDraw={draw.canDraw}
              language={lang}
            />
          </div>
        </section>

        <section id="history-area" className="mt-12 sm:mt-16 max-w-2xl mx-auto">
          <HistoryList history={draw.history} language={lang} onClear={draw.clearHistory} />
        </section>
      </main>

      {/* Footer — 极简 */}
      <footer id="app-footer" className="py-6 text-center text-xs text-muted-foreground/70 border-t border-border/30">
        <p>{t("footerInfo", String(10), String(3))}</p>
        <p id="app-footer-version" className="mt-1 font-mono">
          v{APP_VERSION}
        </p>
      </footer>
    </div>
  );
}

