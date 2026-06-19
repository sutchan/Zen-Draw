// app/page.tsx v3.2 — 安全 + 无障碍 + 架构重构版本
// 变更摘要：
//  - 所有 useLocalStorage 状态仅在 RandomDrawApp 顶层声明一次，避免不同组件读取不同步的存储值
//  - DrawDisplay / SettingsPanel 改为通过 props 接收值与 setter
//  - 所有随机数通过 crypto.getRandomValues 生成（经由 lib/utils.secureRandomInt）
//  - Blob URL 导出后立即 revokeObjectURL，避免内存泄漏
//  - 自定义名单导入时使用 sanitizeListInput 过滤控制字符
//  - 动画计时器使用 window.setInterval（类型 number | null），卸载 & 提前结束时清理
//  - Dialog / 按钮 / 侧边栏添加 role / aria-* 属性，支持屏幕阅读器
"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Settings2, RefreshCw, History, Trash2, Dices, X, Languages, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "next-themes";
import {
  usePresetTheme,
  useThemeMounted,
  THEME_PRESETS,
  FONT_FAMILIES,
  type ThemePreset,
  type FontFamily,
} from "@/components/theme-provider";
import { cn, sanitizeListInput, generateLocalId, secureRandomInt, parseFiniteNumber } from "@/lib/utils";
import { translations, type Language } from "@/locales";
import { NumberRoller } from "@/components/number-roller";
import { useLocalStorage } from "@/hooks/use-local-storage";

// ---------------------------------------------------------------------------
// 常量
// ---------------------------------------------------------------------------
const APPLE_EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
const TICK_MS = 80; // 动画刷新间隔

// ---------------------------------------------------------------------------
// 抽取逻辑（纯函数，便于测试）
// ---------------------------------------------------------------------------
interface FinalizeDrawArgs {
  useCustomList: boolean;
  customList: string[];
  count: number;
  allowDuplicates: boolean;
  min: number;
  max: number;
  formatNumber: (n: number) => string;
}

function finalizeDraw(args: FinalizeDrawArgs): string[] {
  const { useCustomList, customList, count, allowDuplicates, min, max, formatNumber } = args;
  if (useCustomList && customList.length > 0) {
    if (allowDuplicates) {
      return Array.from({ length: count }, () => customList[secureRandomInt(customList.length)]);
    }
    const pool = [...customList];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = secureRandomInt(i + 1);
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, Math.min(count, pool.length));
  }
  const range = Math.max(0, max - min + 1);
  if (allowDuplicates) {
    return Array.from({ length: count }, () => formatNumber(secureRandomInt(range) + min));
  }
  const pool: number[] = Array.from({ length: range }, (_, i) => i + min);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(count, pool.length)).map(formatNumber);
}

function generateTemporaryResults(args: FinalizeDrawArgs): string[] {
  const { useCustomList, customList, count, min, max, formatNumber } = args;
  if (useCustomList && customList.length > 0) {
    return Array.from({ length: count }, () => customList[secureRandomInt(customList.length)]);
  }
  const range = Math.max(0, max - min + 1);
  return Array.from({ length: count }, () => formatNumber(secureRandomInt(range) + min));
}

// ---------------------------------------------------------------------------
// 子组件：中央显示与主操作按钮
// ---------------------------------------------------------------------------
interface DrawDisplayProps {
  results: string[];
  isDrawing: boolean;
  onDraw: () => void;
  t: typeof translations["en"];
  showUI: boolean;
  onToggleUI: () => void;
  lang: Language;
  onToggleLang: () => void;
}

function DrawDisplay({
  results,
  isDrawing,
  onDraw,
  t,
  showUI,
  onToggleUI,
  lang,
  onToggleLang,
}: DrawDisplayProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      id="main-display"
      className={cn(
        "flex-1 flex flex-col items-center justify-center relative pt-14",
        showUI ? "lg:pr-[380px]" : "pr-0"
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget && showUI) onToggleUI();
      }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: APPLE_EASE }}
    >
      {/* 顶栏：标题 + 语言切换 */}
      <motion.div
        className="absolute top-4 left-4 lg:left-8 flex items-center gap-3 z-40"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: APPLE_EASE, delay: 0.1 }}
      >
        <div className="w-8 h-8 bg-foreground rounded-[10px] flex items-center justify-center">
          <Dices className="h-4 w-4 text-background" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-base font-semibold tracking-tight leading-none">{t.title}</h1>
          <span className="text-[10px] text-muted-foreground/60 font-mono">v3.2</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleLang}
          aria-label={t.switchLang}
          title={t.switchLang}
          className="rounded-xl hover:bg-muted transition-colors ml-2"
        >
          <Languages className="h-[18px] w-[18px]" aria-hidden="true" />
        </Button>
      </motion.div>

      {/* 结果区 */}
      <motion.div
        id="results-container"
        className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl px-8 py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        aria-live="polite"
      >
        {results.length === 0 ? (
          <motion.div
            className="text-center space-y-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.div
              animate={shouldReduceMotion ? {} : { y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto"
              aria-hidden="true"
            >
              <Dices className="h-40 w-40 text-muted-foreground/10 mx-auto" aria-hidden="true" />
            </motion.div>
            <div className="space-y-3">
              <p className="text-5xl md:text-6xl lg:text-7xl text-foreground/85 font-semibold tracking-tight">
                {t.ready}
              </p>
              <p className="text-sm text-muted-foreground/50">{t.configureHint}</p>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-wrap justify-center content-center gap-8 sm:gap-12 w-full h-full">
            <AnimatePresence mode="popLayout">
              {results.map((result, idx) => (
                <motion.div
                  key={`${idx}-${result}`}
                  initial={{ opacity: 0, scale: 0.4, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -50 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.8 }}
                  className="flex items-center justify-center"
                  aria-label={`Result ${idx + 1}: ${result}`}
                >
                  <div className="bg-background text-foreground rounded-[2rem] px-12 py-10 sm:px-16 sm:py-12 text-center border border-border/15 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] min-w-[240px] sm:min-w-[300px]">
                    <NumberRoller
                      value={result}
                      isDrawing={isDrawing}
                      className="text-7xl sm:text-8xl md:text-9xl lg:text-[12vw] font-bold tracking-tighter tabular-nums leading-none"
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* 主操作按钮 */}
      <motion.div
        id="action-container"
        className="w-full max-w-md px-6 pb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <motion.div whileHover={isDrawing ? {} : { scale: 1.02 }} whileTap={isDrawing ? {} : { scale: 0.98 }}>
          <Button
            id="draw-button"
            size="lg"
            aria-label={isDrawing ? t.drawing : results.length > 0 ? t.drawAgain : t.startDraw}
            className={cn(
              "w-full h-16 sm:h-[72px] text-xl sm:text-2xl font-semibold rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300",
              results.length > 0
                ? "bg-muted text-foreground hover:bg-muted/80"
                : "bg-foreground text-background hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)]"
            )}
            onClick={onDraw}
            disabled={isDrawing}
          >
            {isDrawing ? (
              <motion.div className="flex items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  aria-hidden="true"
                >
                  <RefreshCw className="h-7 w-7" aria-hidden="true" />
                </motion.div>
                <span>{t.drawing}</span>
              </motion.div>
            ) : (
              <motion.div className="flex items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Dices className="h-7 w-7" aria-hidden="true" />
                <span>{results.length > 0 ? t.drawAgain : t.startDraw}</span>
              </motion.div>
            )}
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// 子组件：设置侧边栏
// ---------------------------------------------------------------------------
interface SettingsPanelProps {
  open: boolean;
  onToggle: () => void;
  t: typeof translations["en"];
  // 抽号设置
  min: number; setMin: (n: number) => void;
  max: number; setMax: (n: number) => void;
  count: number; setCount: (n: number) => void;
  allowDuplicates: boolean; setAllowDuplicates: (b: boolean) => void;
  autoHide: boolean; setAutoHide: (b: boolean) => void;
  duration: number; setDuration: (n: number) => void;
  // 自定义列表
  customList: string[]; setCustomList: (items: string[]) => void;
  useCustomList: boolean; setUseCustomList: (b: boolean) => void;
  // 显示规则
  digits: number; setDigits: (n: number) => void;
  prefix: string; setPrefix: (s: string) => void;
  suffix: string; setSuffix: (s: string) => void;
  // 历史
  history: { id: string; timestamp: string; results: string[] }[];
  setHistory: (updater: (
    prev: { id: string; timestamp: string; results: string[] }[]
  ) => { id: string; timestamp: string; results: string[] }[]) => void;
}

function SettingsPanel({
  open, onToggle, t,
  min, setMin, max, setMax, count, setCount,
  allowDuplicates, setAllowDuplicates, autoHide, setAutoHide,
  duration, setDuration, customList, setCustomList, useCustomList, setUseCustomList,
  digits, setDigits, prefix, setPrefix, suffix, setSuffix,
  history, setHistory,
}: SettingsPanelProps) {
  const { theme, setTheme } = useTheme();
  const { preset, setPreset, font, setFont } = usePresetTheme();
  const mounted = useThemeMounted();

  const [importDialogOpen, setImportDialogOpen] = React.useState(false);
  const [importText, setImportText] = React.useState("");

  const handleImportSubmit = React.useCallback(() => {
    const sanitized = sanitizeListInput(importText);
    if (sanitized.length > 0) {
      setCustomList(sanitized);
      setUseCustomList(true);
    }
    setImportDialogOpen(false);
    setImportText("");
  }, [importText, setCustomList, setUseCustomList]);

  const exportHistory = React.useCallback(() => {
    const data = history.map((h) => h.results.join(", ")).join("\n");
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "draw-results.txt";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }, [history]);

  return (
    <>
      {/* Toggle 按钮 */}
      <motion.div
        className="absolute top-4 right-4 lg:right-8 z-50"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: APPLE_EASE, delay: 0.1 }}
      >
        <Button
          variant={open ? "secondary" : "ghost"}
          size="icon"
          onClick={onToggle}
          aria-label={t.toggleUI}
          aria-expanded={open}
          aria-controls="sidebar-panel"
          title={t.toggleUI}
          className={cn("rounded-xl transition-all duration-300")}
        >
          {open ? (
            <X className="h-[18px] w-[18px]" aria-hidden="true" />
          ) : (
            <Menu className="h-[18px] w-[18px]" aria-hidden="true" />
          )}
        </Button>
      </motion.div>

      {/* 移动端遮罩 */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: APPLE_EASE }}
            onClick={onToggle}
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-30 lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* 侧边栏 */}
      <motion.aside
        id="sidebar-panel"
        role="complementary"
        aria-label={t.settings}
        className={cn(
          "absolute inset-y-0 right-0 z-40 w-full sm:w-[380px] bg-background/92 backdrop-blur-xl border-l border-border/30 flex flex-col",
          open ? "translate-x-0" : "translate-x-full pointer-events-none"
        )}
        initial={false}
        animate={{ x: open ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
      >
        <motion.div
          id="sidebar-header"
          className="px-6 py-5 border-b border-border/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-semibold tracking-tight">{t.settings}</h2>
        </motion.div>

        <div id="sidebar-content" className="flex-1 overflow-y-auto">
          <Tabs defaultValue="settings" className="w-full">
            <TabsList className="w-full flex gap-1 p-1 bg-muted/40 rounded-xl m-5 mb-0">
              <TabsTrigger value="settings" className="flex-1 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium">
                <Settings2 className="h-4 w-4 mr-1.5" aria-hidden="true" />
                {t.settings}
              </TabsTrigger>
              <TabsTrigger value="history" className="flex-1 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium">
                <History className="h-4 w-4 mr-1.5" aria-hidden="true" />
                {t.history}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="settings" className="px-6 pb-8 space-y-10 focus-visible:outline-none">
              {/* 抽号设置 */}
              <motion.div id="settings-range" className="space-y-5 pt-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.drawSettings}</p>

                {!useCustomList && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="min" className="text-sm font-medium">{t.minVal}</Label>
                      <Input
                        id="min"
                        type="number"
                        value={min}
                        onChange={(e) =>
                          setMin(parseFiniteNumber(e.target.value, 0))
                        }
                        className="h-11 rounded-2xl bg-muted/40 border border-border/20 focus:ring-2 focus:ring-primary/15 focus:bg-background transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max" className="text-sm font-medium">{t.maxVal}</Label>
                      <Input
                        id="max"
                        type="number"
                        value={max}
                        onChange={(e) =>
                          setMax(parseFiniteNumber(e.target.value, 0))
                        }
                        className="h-11 rounded-2xl bg-muted/40 border border-border/20 focus:ring-2 focus:ring-primary/15 focus:bg-background transition-all"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="count" className="text-sm font-medium">{t.drawCount}</Label>
                  <Input
                    id="count"
                    type="number"
                    min={1}
                    max={1000}
                    value={count}
                    onChange={(e) =>
                      setCount(Math.max(1, Math.min(1000, parseFiniteNumber(e.target.value, 1))))
                    }
                    className="h-11 rounded-2xl bg-muted/40 border border-border/20 focus:ring-2 focus:ring-primary/15 focus:bg-background transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-sm font-medium">{t.drawDuration}</Label>
                  <Input
                    id="duration"
                    type="number"
                    min={1}
                    max={120}
                    value={duration}
                    onChange={(e) =>
                      setDuration(Math.max(1, Math.min(120, parseFiniteNumber(e.target.value, 3))))
                    }
                    className="h-11 rounded-2xl bg-muted/40 border border-border/20 focus:ring-2 focus:ring-primary/15 focus:bg-background transition-all"
                  />
                  <p className="text-xs text-muted-foreground leading-relaxed">{t.drawDurationDesc}</p>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border/30">
                  <Label htmlFor="duplicates" className="cursor-pointer text-sm font-medium">{t.allowDup}</Label>
                  <Switch id="duplicates" checked={allowDuplicates} onCheckedChange={setAllowDuplicates} />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-hide" className="cursor-pointer text-sm font-medium">{t.autoHide}</Label>
                    <p className="text-xs text-muted-foreground leading-relaxed">{t.autoHideDesc}</p>
                  </div>
                  <Switch id="auto-hide" checked={autoHide} onCheckedChange={setAutoHide} />
                </div>
              </motion.div>

              {/* 外观 */}
              <motion.div className="space-y-5 pt-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.appearance}</p>

                <div className="space-y-3">
                  <Label htmlFor="theme-mode" className="text-sm font-medium">{t.themeMode}</Label>
                  {mounted ? (
                    <Select value={theme ?? "system"} onValueChange={(v) => setTheme(v ?? "system")}>
                      <SelectTrigger id="theme-mode" className="h-11 rounded-xl bg-muted/40 border-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">{t.themeLight}</SelectItem>
                        <SelectItem value="dark">{t.themeDark}</SelectItem>
                        <SelectItem value="system">{t.themeSystem}</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="h-11 rounded-xl bg-muted/40" aria-hidden="true" />
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="theme-preset" className="text-sm font-medium">{t.themePreset}</Label>
                  <Select
                    value={preset}
                    onValueChange={(value) => {
                      const v = (value ?? "default") as ThemePreset;
                      if ((THEME_PRESETS as readonly string[]).includes(v)) setPreset(v);
                    }}
                  >
                    <SelectTrigger id="theme-preset" className="h-11 rounded-xl bg-muted/40 border-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {THEME_PRESETS.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p === "default" ? t.themeDefault :
                           p === "ocean" ? t.themeOcean :
                           p === "forest" ? t.themeForest :
                           p === "sunset" ? t.themeSunset :
                           p === "purple" ? t.themePurple :
                           p === "neon" ? t.themeNeon : p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="font-family" className="text-sm font-medium">{t.fontFamily}</Label>
                  <Select
                    value={font}
                    onValueChange={(value) => {
                      const v = (value ?? "sans") as FontFamily;
                      if ((FONT_FAMILIES as readonly string[]).includes(v)) setFont(v);
                    }}
                  >
                    <SelectTrigger id="font-family" className="h-11 rounded-xl bg-muted/40 border-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sans">{t.fontSans}</SelectItem>
                      <SelectItem value="mono">{t.fontMono}</SelectItem>
                      <SelectItem value="serif">{t.fontSerif}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>

              {/* 自定义列表 */}
              <motion.div className="space-y-5 pt-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.custom}</p>

                <div className="flex items-center justify-between py-3 border-b border-border/30">
                  <div className="space-y-0.5">
                    <Label htmlFor="use-custom-list" className="cursor-pointer text-sm font-medium">{t.useCustomList}</Label>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {customList.length > 0 ? `${customList.length} ${t.itemsLoaded}` : t.noItems}
                    </p>
                  </div>
                  <Switch id="use-custom-list" checked={useCustomList} onCheckedChange={setUseCustomList} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setImportText(customList.join("\n"));
                      setImportDialogOpen(true);
                    }}
                    className="h-11 rounded-xl hover:bg-muted/50 transition-colors border-border/30"
                  >
                    {t.listImport}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={exportHistory}
                    className="h-11 rounded-xl hover:bg-muted/50 transition-colors border-border/30"
                  >
                    {t.export}
                  </Button>
                </div>
              </motion.div>

              {/* 显示规则 */}
              {!useCustomList && (
                <motion.div id="settings-display" className="space-y-5 pt-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.display}</p>

                  <div className="space-y-3">
                    <Label htmlFor="digits" className="text-sm font-medium">{t.minDigits}</Label>
                    <Input
                      id="digits"
                      type="number"
                      min={0}
                      max={20}
                      value={digits}
                      onChange={(e) =>
                        setDigits(Math.max(0, Math.min(20, parseFiniteNumber(e.target.value, 0))))
                      }
                      className="h-11 rounded-2xl bg-muted/40 border border-border/20 focus:ring-2 focus:ring-primary/15 focus:bg-background transition-all"
                    />
                    <p className="text-xs text-muted-foreground leading-relaxed">{t.minDigitsDesc}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="prefix" className="text-sm font-medium">{t.prefix}</Label>
                      <Input
                        id="prefix"
                        value={prefix}
                        onChange={(e) =>
                          setPrefix(e.target.value.replace(/[\x00-\x1f]/g, "").slice(0, 50))
                        }
                        className="h-11 rounded-2xl bg-muted/40 border border-border/20 focus:ring-2 focus:ring-primary/15 focus:bg-background transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="suffix" className="text-sm font-medium">{t.suffix}</Label>
                      <Input
                        id="suffix"
                        value={suffix}
                        onChange={(e) =>
                          setSuffix(e.target.value.replace(/[\x00-\x1f]/g, "").slice(0, 50))
                        }
                        className="h-11 rounded-2xl bg-muted/40 border border-border/20 focus:ring-2 focus:ring-primary/15 focus:bg-background transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="history" className="px-6 pb-8 focus-visible:outline-none">
              <div id="history-header" className="flex items-center justify-between py-5">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{t.drawHistory}</h3>
                  <p className="text-sm text-muted-foreground">{t.historyDesc}</p>
                </div>
                {history.length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setHistory(() => [])}
                    aria-label={t.clearHistory}
                    title={t.clearHistory}
                    className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                )}
              </div>

              <div id="history-list" className="space-y-3" aria-live="polite">
                {history.length === 0 ? (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-16 text-center text-muted-foreground text-sm border-2 border-dashed rounded-2xl bg-muted/20">
                    {t.noHistory}
                  </motion.div>
                ) : (
                  <motion.div
                    className="space-y-3"
                    initial="hidden"
                    animate="show"
                    variants={{ show: { transition: { staggerChildren: 0.05 } } }}
                  >
                    {history.map((record) => (
                      <motion.div
                        key={record.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 rounded-2xl bg-muted/20 hover:bg-muted/40 transition-colors border border-transparent hover:border-border/30"
                      >
                        <div className="text-xs text-muted-foreground mb-4 font-medium">
                          {new Date(record.timestamp).toLocaleString()}
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                          {record.results.map((res, idx) => (
                            <span
                              key={`${record.id}-${idx}-${res}`}
                              className="inline-flex items-center justify-center px-3.5 py-2 rounded-xl bg-background/80 shadow-sm text-sm font-semibold border border-border/20 backdrop-blur-sm"
                            >
                              {res}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </motion.aside>

      {/* 自定义列表导入 Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-2xl border-border/30">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{t.listImport}</DialogTitle>
            <DialogDescription>{t.listImportDesc}</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Textarea
              placeholder={t.listImportDesc}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="min-h-[200px] rounded-xl resize-none bg-muted/40 border-0 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setImportDialogOpen(false)} className="flex-1 h-11 rounded-xl border-border/30">
              {t.cancel}
            </Button>
            <Button onClick={handleImportSubmit} className="flex-1 h-11 rounded-xl">
              {t.import_}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ---------------------------------------------------------------------------
// 主应用组件
// ---------------------------------------------------------------------------
export default function RandomDrawApp() {
  // 语言与元信息
  const [lang, setLang] = useLocalStorage<Language>("zendraw-lang", "zh");
  const t = translations[lang];

  const [showUI, setShowUI] = React.useState(true);
  const [, setHasOpenedOnce] = React.useState(false);

  // 抽号设置
  const [min, setMin] = useLocalStorage<number>("zendraw-min", 1);
  const [max, setMax] = useLocalStorage<number>("zendraw-max", 100);
  const [count, setCount] = useLocalStorage<number>("zendraw-count", 1);
  const [allowDuplicates, setAllowDuplicates] = useLocalStorage<boolean>("zendraw-duplicates", true);
  const [autoHide, setAutoHide] = useLocalStorage<boolean>("zendraw-autohide", true);
  const [duration, setDuration] = useLocalStorage<number>("zendraw-duration", 5);

  // 自定义列表
  const [customList, setCustomList] = useLocalStorage<string[]>("zendraw-custom-list", []);
  const [useCustomList, setUseCustomList] = useLocalStorage<boolean>("zendraw-use-custom", false);

  // 显示规则
  const [digits, setDigits] = useLocalStorage<number>("zendraw-digits", 3);
  const [prefix, setPrefix] = useLocalStorage<string>("zendraw-prefix", "");
  const [suffix, setSuffix] = useLocalStorage<string>("zendraw-suffix", "");

  // 抽取状态
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [currentResults, setCurrentResults] = React.useState<string[]>([]);

  // 历史记录
  const [history, setHistory] = useLocalStorage<{ id: string; timestamp: string; results: string[] }[]>(
    "zendraw-history",
    []
  );

  // 错误提示
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");

  // 动画计时器
  const animationIntervalRef = React.useRef<number | null>(null);

  // 更新 html.lang（使用白名单防止任意字符串写入）
  React.useEffect(() => {
    if (typeof document !== "undefined") {
      const validLangs: Language[] = ["en", "zh"];
      document.documentElement.lang = validLangs.includes(lang) ? lang : "en";
    }
  }, [lang]);

  // 空闲自动隐藏
  React.useEffect(() => {
    if (!showUI || !autoHide || isDrawing) return;
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
  }, [showUI, autoHide, isDrawing]);

  // 数字格式化
  const formatNumber = React.useCallback(
    (num: number) => {
      let str = num.toString();
      if (digits > 0) {
        str = str.padStart(Math.max(0, Math.floor(digits)), "0");
      }
      return `${prefix}${str}${suffix}`;
    },
    [digits, prefix, suffix]
  );

  // 抽取动作
  const handleDraw = React.useCallback(() => {
    if (isDrawing) {
      if (animationIntervalRef.current !== null) {
        window.clearInterval(animationIntervalRef.current);
        animationIntervalRef.current = null;
      }
      const finalResults = finalizeDraw({
        useCustomList,
        customList,
        count,
        allowDuplicates,
        min,
        max,
        formatNumber,
      });
      setCurrentResults(finalResults);
      setHistory((prev) => [
        {
          id: generateLocalId(),
          timestamp: new Date().toISOString(),
          results: finalResults,
        },
        ...prev,
      ]);
      setIsDrawing(false);
      return;
    }

    // 安全的输入校验 — 确保所有参数都是有限数字且在合理范围内
    const safeMin = Number.isFinite(min) ? min : 0;
    const safeMax = Number.isFinite(max) ? max : 0;
    const safeCount = Math.max(1, Math.min(1000, Number.isFinite(count) ? count : 1));
    const safeRange = safeMax - safeMin + 1;

    if (useCustomList) {
      if (customList.length === 0) {
        setAlertMessage(t.listImportDesc);
        setAlertOpen(true);
        return;
      }
      if (customList.length > 1000) {
        setAlertMessage(t.rangeError);
        setAlertOpen(true);
        return;
      }
      if (!allowDuplicates && safeCount > customList.length) {
        setAlertMessage(t.rangeError);
        setAlertOpen(true);
        return;
      }
    } else {
      if (!Number.isFinite(safeMin) || !Number.isFinite(safeMax) || safeMin > safeMax) {
        setAlertMessage(t.minMaxError);
        setAlertOpen(true);
        return;
      }
      // 限制范围大小，防止过大范围导致的性能问题
      if (safeRange <= 0 || safeRange > 10_000_000) {
        setAlertMessage(t.rangeError);
        setAlertOpen(true);
        return;
      }
      if (!allowDuplicates && safeCount > safeRange) {
        setAlertMessage(t.rangeError);
        setAlertOpen(true);
        return;
      }
    }

    setIsDrawing(true);
    setShowUI(false);

    const totalMs = Math.max(1000, duration * 1000);
    const tickCount = Math.max(1, Math.floor(totalMs / TICK_MS));
    let step = 0;

    animationIntervalRef.current = window.setInterval(() => {
      step += 1;
      setCurrentResults(
        generateTemporaryResults({
          useCustomList,
          customList,
          count,
          allowDuplicates,
          min,
          max,
          formatNumber,
        })
      );
      if (step >= tickCount) {
        if (animationIntervalRef.current !== null) {
          window.clearInterval(animationIntervalRef.current);
          animationIntervalRef.current = null;
        }
        const finalResults = finalizeDraw({
          useCustomList,
          customList,
          count,
          allowDuplicates,
          min,
          max,
          formatNumber,
        });
        setCurrentResults(finalResults);
        setHistory((prev) => [
          {
            id: generateLocalId(),
            timestamp: new Date().toISOString(),
            results: finalResults,
          },
          ...prev,
        ]);
        setIsDrawing(false);
      }
    }, TICK_MS);
  }, [isDrawing, useCustomList, customList, count, allowDuplicates, min, max, duration, t, formatNumber, setHistory]);

  // 卸载清理
  React.useEffect(() => {
    return () => {
      if (animationIntervalRef.current !== null) {
        window.clearInterval(animationIntervalRef.current);
        animationIntervalRef.current = null;
      }
    };
  }, []);

  const onToggleUI = React.useCallback(() => {
    setShowUI((prev) => {
      const next = !prev;
      if (next) setHasOpenedOnce(true);
      return next;
    });
  }, []);

  return (
    <div
      id="app-root"
      className="h-screen w-screen overflow-hidden bg-background text-foreground relative flex"
    >
      <SettingsPanel
        open={showUI}
        onToggle={onToggleUI}
        t={t}
        min={min} setMin={setMin}
        max={max} setMax={setMax}
        count={count} setCount={setCount}
        allowDuplicates={allowDuplicates} setAllowDuplicates={setAllowDuplicates}
        autoHide={autoHide} setAutoHide={setAutoHide}
        duration={duration} setDuration={setDuration}
        customList={customList} setCustomList={setCustomList}
        useCustomList={useCustomList} setUseCustomList={setUseCustomList}
        digits={digits} setDigits={setDigits}
        prefix={prefix} setPrefix={setPrefix}
        suffix={suffix} setSuffix={setSuffix}
        history={history} setHistory={setHistory}
      />

      {/* Alert Dialog */}
      <Dialog open={alertOpen} onOpenChange={setAlertOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-2xl border-border/30">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{t.notice}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm leading-relaxed">{alertMessage}</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setAlertOpen(false)} className="w-full h-11 rounded-xl">
              {t.ok}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DrawDisplay
        results={currentResults}
        isDrawing={isDrawing}
        onDraw={handleDraw}
        t={t}
        showUI={showUI}
        onToggleUI={onToggleUI}
        lang={lang}
        onToggleLang={() => setLang(lang === "en" ? "zh" : "en")}
      />
    </div>
  );
}
