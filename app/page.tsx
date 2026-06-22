// app/page.tsx v4.0 —— 模块化重构版本（基于 hooks/use-draw.ts）
"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

// 子组件
import { DrawDisplay } from "@/components/draw/draw-display";
import { SettingsPanel } from "@/components/draw/settings-panel";
import { DrawButton } from "@/components/draw/draw-button";
import { HistoryList } from "@/components/draw/history-list";

// 状态管理 Hook
import { useDraw } from "@/hooks/use-draw";

// 语言与持久化
import { translations, type Language } from "@/locales";
import { useLocalStorage } from "@/hooks/use-local-storage";

// UI 组件
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// 主应用组件
// ---------------------------------------------------------------------------

export default function RandomDrawApp() {
  // 语言与元信息
  const [lang, setLang] = useLocalStorage<Language>("zendraw-lang", "zh");
  const t = translations[lang];

  // 使用集中管理的抽取 Hook
  const draw = useDraw();
  const {
    results,
    isDrawing,
    canDraw,
    history,
    startDraw,
    stopDraw,
    setMin,
    setMax,
    setCount,
    setDuration,
    setAllowDuplicates,
    setAutoHide,
    setCustomList,
    setUseCustomList,
    setDigits,
    setPrefix,
    setSuffix,
    settings,
    clearHistory,
  } = draw;

  // 错误提示状态（从 draw.state 读取，但也提供本地 Dialog）
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");

  // 视觉优化
  const shouldReduceMotion = useReducedMotion();

  // 设置面板显示状态（独立的 UI 层状态）
  const [showUI, setShowUI] = React.useState(true);

  // 更新 html.lang（使用白名单防止任意字符串写入）
  React.useEffect(() => {
    if (typeof document !== "undefined") {
      const validLangs: Language[] = ["en", "zh"];
      document.documentElement.lang = validLangs.includes(lang) ? lang : "en";
    }
  }, [lang]);

  // 空闲自动隐藏 UI（侧边栏）
  React.useEffect(() => {
    if (!showUI || !settings.autoHide || isDrawing) return;
    let timer: number | null = null;
    const reset = () => {
      if (timer !== null) window.clearTimeout(timer);
      timer = window.setTimeout(() => setShowUI(false), 8000);
    };
    reset();
    const onMove = () => reset();
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("keydown", onMove, { passive: true });
    window.addEventListener("touchstart", onMove, { passive: true });
    return () => {
      if (timer !== null) window.clearTimeout(timer);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("keydown", onMove);
      window.removeEventListener("touchstart", onMove);
    };
  }, [showUI, settings.autoHide, isDrawing]);

  // 抽取的主入口（包装一层错误处理）
  const handleDraw = React.useCallback(() => {
    if (isDrawing) {
      stopDraw();
      return;
    }
    // 输入校验失败时显示错误提示
    const result = startDraw();
    if (!result.ok) {
      setAlertMessage(result.error || "");
      setAlertOpen(true);
    }
  }, [isDrawing, startDraw, stopDraw]);

  // 键盘快捷键：空格键开始/停止
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // 仅处理空格键（且不在输入框内）
      const target = e.target as HTMLElement | null;
      const isEditable =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          (target as HTMLElement).isContentEditable);
      if (e.code === "Space" && !isEditable) {
        e.preventDefault();
        handleDraw();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleDraw]);

  // UI 切换（移动端/桌面端通用）
  const onToggleUI = React.useCallback(() => {
    setShowUI((prev) => !prev);
  }, []);

  return (
    <div
      id="app-root"
      className="h-screen w-screen overflow-hidden bg-background text-foreground relative flex"
    >
      {/* 设置侧边栏（内嵌 history 显示） */}
      <SettingsPanel
        open={showUI}
        onToggle={onToggleUI}
        // 抽取设置（从 Hook 的 settings 对象中获取）
        min={settings.min}
        onMinChange={setMin}
        max={settings.max}
        onMaxChange={setMax}
        count={settings.count}
        onCountChange={setCount}
        duration={settings.duration}
        onDurationChange={setDuration}
        allowDuplicates={settings.allowDuplicates}
        onAllowDuplicatesChange={setAllowDuplicates}
        autoHide={settings.autoHide}
        onAutoHideChange={setAutoHide}
        // 自定义列表
        customList={settings.customList}
        onCustomListChange={setCustomList}
        useCustomList={settings.useCustomList}
        onUseCustomListChange={setUseCustomList}
        // 显示规则
        digits={settings.digits}
        onDigitsChange={setDigits}
        prefix={settings.prefix}
        onPrefixChange={setPrefix}
        suffix={settings.suffix}
        onSuffixChange={setSuffix}
        // 语言切换
        language={lang}
        onLanguageToggle={() => setLang(lang === "en" ? "zh" : "en")}
      />

      {/* 主显示区（欢迎 + 结果） */}
      <div
        id="main-display"
        className={cn(
          "flex-1 flex flex-col items-center justify-center relative",
          showUI ? "lg:pr-[400px]" : "pr-0"
        )}
      >
        <DrawDisplay
          results={results}
          isDrawing={isDrawing}
          showUI={showUI}
          onToggleUI={onToggleUI}
        />

        {/* 主操作按钮 */}
        <DrawButton
          isDrawing={isDrawing}
          onStart={handleDraw}
          onStop={handleDraw}
          canDraw={canDraw}
          language={lang}
        />
      </div>

      {/* 错误提示 Dialog（备用，Hook 内部有 errorMessage） */}
      <Dialog open={alertOpen} onOpenChange={setAlertOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-2xl border-border/30">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{t.notice}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm leading-relaxed">{alertMessage}</p>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setAlertOpen(false)}
              className="w-full h-11 rounded-xl"
            >
              {t.ok}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
