// components/draw/settings-panel.tsx v3.0 —— 设置侧边栏（重构拆分版）
"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Menu, X, Settings2, History, Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { HistoryList, type HistoryEntry } from "@/components/draw/history-list";
import { DrawSettings } from "./draw-settings";
import { AppearanceSettings } from "./appearance-settings";
import { CustomListSettings } from "./custom-list-settings";
import {
  usePresetTheme,
  useThemeMounted,
  THEME_PRESETS,
  type ThemePreset,
} from "@/components/theme-provider";
import { useTheme } from "next-themes";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SettingsPanelProps {
  // 抽取设置
  min: number;
  max: number;
  count: number;
  duration: number;
  allowDuplicates: boolean;
  autoHide: boolean;
  // 自定义列表
  customList: string[];
  useCustomList: boolean;
  // 显示设置
  digits: number;
  prefix: string;
  suffix: string;
  // 控制
  open: boolean;
  onToggle: () => void;
  // 设置更新
  onMinChange: (value: number | string) => void;
  onMaxChange: (value: number | string) => void;
  onCountChange: (value: number | string) => void;
  onDurationChange: (value: number | string) => void;
  onAllowDuplicatesChange: (value: boolean) => void;
  onAutoHideChange: (value: boolean) => void;
  onCustomListChange: (items: string[]) => void;
  onUseCustomListChange: (value: boolean) => void;
  onDigitsChange: (value: number | string) => void;
  onPrefixChange: (value: string) => void;
  onSuffixChange: (value: string) => void;
  // 语言切换
  language: "zh" | "en";
  onLanguageToggle: () => void;
  // 历史记录
  history: HistoryEntry[];
  onClearHistory: () => void;
}

// ---------------------------------------------------------------------------
// Sub-component: Toggle Button (侧边栏开关)
// ---------------------------------------------------------------------------

function SidebarToggle({
  open,
  onToggle,
  t,
}: {
  open: boolean;
  onToggle: () => void;
  t: { toggle: string; open: string; close: string };
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="absolute top-4 right-4 lg:right-8 z-50"
    >
      <Button
        variant={open ? "secondary" : "ghost"}
        size="icon"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls="settings-panel"
        title={t.toggle}
        aria-label={t.toggle}
        className="rounded-xl transition-all duration-300 hover:scale-105"
      >
        {open ? (
          <X className="w-5 h-5" aria-hidden="true" />
        ) : (
          <Menu className="w-5 h-5" aria-hidden="true" />
        )}
      </Button>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: 标题栏（顶部）
// ---------------------------------------------------------------------------

function HeaderBar({ t, language, onLanguageToggle }: {
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

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function SettingsPanel(props: SettingsPanelProps) {
  const shouldReduceMotion = useReducedMotion();
  const {
    open,
    onToggle,
    min, max, count, duration,
    allowDuplicates, autoHide,
    customList, useCustomList,
    digits, prefix, suffix,
    onMinChange, onMaxChange, onCountChange, onDurationChange,
    onAllowDuplicatesChange, onAutoHideChange,
    onCustomListChange, onUseCustomListChange,
    onDigitsChange, onPrefixChange, onSuffixChange,
    language, onLanguageToggle,
    history, onClearHistory,
  } = props;

  const t = React.useMemo(() => {
    const isZH = language === "zh";
    return {
      // 基础
      title: isZH ? "随机抽取" : "Random Draw",
      version: isZH ? "v3.3.0" : "v3.3.0",
      toggle: open ? (isZH ? "收起设置" : "Collapse Settings") : (isZH ? "展开设置" : "Expand Settings"),
      // 设置
      drawSettings: isZH ? "抽取设置" : "Draw Settings",
      minVal: isZH ? "最小值" : "Minimum",
      maxVal: isZH ? "最大值" : "Maximum",
      drawCount: isZH ? "抽取数量" : "Count",
      duration: isZH ? "动画时长（秒）" : "Animation Duration (sec)",
      durationHint: isZH ? "数字滚动动画的持续时间，1~120 秒" : "Duration of the rolling animation, 1~120 seconds",
      allowDup: isZH ? "允许重复" : "Allow Duplicates",
      autoHide: isZH ? "自动隐藏 UI" : "Auto-hide UI",
      autoHideHint: isZH ? "抽取时自动隐藏设置，点击空白处显示" : "Hide settings automatically during drawing",
      display: isZH ? "显示格式" : "Display",
      minDigits: isZH ? "补零位数" : "Leading Zeros",
      minDigitsHint: isZH ? "设置 3 则显示 001、002、...，0 表示不补零" : "Set to 3 to display as 001, 002, etc. Set to 0 to disable",
      prefix: isZH ? "前缀" : "Prefix",
      suffix: isZH ? "后缀" : "Suffix",
      custom: isZH ? "自定义列表" : "Custom List",
      useCustomList: isZH ? "使用自定义列表" : "Use Custom List",
      itemsLoaded: isZH ? "项已加载" : "items loaded",
      noItems: isZH ? "暂无项目" : "No items",
      importList: isZH ? "导入列表" : "Import",
      exportList: isZH ? "导出列表" : "Export",
      // History
      history: isZH ? "历史记录" : "History",
      historyHint: isZH ? "最近 100 条记录" : "Recent 100 entries",
    };
  }, [language, open]);

  return (
    <>
      {/* 顶部标题栏 */}
      <HeaderBar t={t} language={language} onLanguageToggle={onLanguageToggle} />

      {/* 侧边栏开关按钮 */}
      <SidebarToggle open={open} onToggle={onToggle} t={{
        toggle: t.toggle, open: "展开", close: "收起",
      }} />

      {/* 移动端遮罩 */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
            onClick={onToggle}
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-30 lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* 侧边栏面板 */}
      <motion.aside
        id="settings-panel"
        role="complementary"
        aria-label="设置面板"
        className={cn(
          "absolute top-0 right-0 z-40 h-full w-full sm:w-[400px]",
          "bg-background/94 backdrop-blur-xl border-l border-border/25",
          "flex flex-col overflow-hidden shadow-2xl",
          open ? "translate-x-0" : "translate-x-full pointer-events-none"
        )}
        initial={false}
        animate={{ x: open ? 0 : "100%" }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 0.9,
          duration: shouldReduceMotion ? 0 : undefined,
        }}
      >
        <Tabs defaultValue="settings" className="w-full h-full flex flex-col">
          {/* Tab List */}
          <TabsList className="w-full flex gap-1 p-2 bg-muted/30 rounded-none border-b border-border/20 m-0">
            <TabsTrigger
              value="settings"
              className="flex-1 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium h-10"
            >
              <Settings2 className="w-4 h-4 mr-1.5" aria-hidden="true" />
              {t.drawSettings}
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="flex-1 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium h-10"
            >
              <History className="w-4 h-4 mr-1.5" aria-hidden="true" />
              {t.history}
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="settings" className="px-6 py-6 pb-12 focus-visible:outline-none">
              <DrawSettings
                t={t}
                useCustomList={useCustomList}
                min={min} max={max} count={count} duration={duration}
                allowDuplicates={allowDuplicates} autoHide={autoHide}
                onMin={onMinChange} onMax={onMaxChange}
                onCount={onCountChange} onDuration={onDurationChange}
                onAllowDuplicates={onAllowDuplicatesChange}
                onAutoHide={onAutoHideChange}
              />

              <AppearanceSettings
                t={t}
                language={language}
                useCustomList={useCustomList}
                digits={digits} prefix={prefix} suffix={suffix}
                onDigits={onDigitsChange} onPrefix={onPrefixChange} onSuffix={onSuffixChange}
              />

              <CustomListSettings
                t={t}
                language={language}
                useCustomList={useCustomList} customList={customList}
                onUseCustomListChange={onUseCustomListChange}
                onImport={onCustomListChange}
              />
            </TabsContent>

            <TabsContent value="history" className="px-6 py-6 pb-12 focus-visible:outline-none">
              <HistoryList
                history={history}
                onClear={onClearHistory}
                language={language}
              />
            </TabsContent>
          </div>
        </Tabs>
      </motion.aside>
    </>
  );
}
