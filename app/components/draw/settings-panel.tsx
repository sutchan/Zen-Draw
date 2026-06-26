// components/draw/settings-panel.tsx v2.0 —— 设置侧边栏
"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Menu, X, Settings2, History, Languages, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

// UI Components（简化版）
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sanitizeListInput } from "@/lib/utils";
import { HistoryList, type HistoryEntry } from "@/components/draw/history-list";

// Theme & Types
import {
  usePresetTheme,
  useThemeMounted,
  THEME_PRESETS,
  FONT_FAMILIES,
  type ThemePreset,
  type FontFamily,
} from "@/components/theme-provider";
import { useTheme } from "next-themes";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SettingsPanelState {
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
}

export interface SettingsPanelProps extends SettingsPanelState {
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
// 子组件: Toggle Button (侧边栏开关)
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
// 子组件: 标题栏（顶部）
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
// Sub-component: 抽取设置
// ---------------------------------------------------------------------------

function DrawSettings({
  t,
  useCustomList,
  min, max, count, duration,
  allowDuplicates, autoHide,
  onMin, onMax, onCount, onDuration,
  onAllowDuplicates, onAutoHide,
}: {
  t: { drawSettings: string; minVal: string; maxVal: string; drawCount: string; duration: string; allowDup: string; autoHide: string; autoHideHint: string; durationHint: string };
  useCustomList: boolean;
  min: number;
  max: number;
  count: number;
  duration: number;
  allowDuplicates: boolean;
  autoHide: boolean;
  onMin: (value: number | string) => void;
  onMax: (value: number | string) => void;
  onCount: (value: number | string) => void;
  onDuration: (value: number | string) => void;
  onAllowDuplicates: (value: boolean) => void;
  onAutoHide: (value: boolean) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="space-y-6 pt-2"
    >
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
        {t.drawSettings}
      </p>

      {/* 数值范围 */}
      {!useCustomList && (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="min-value">{t.minVal}</Label>
            <Input
              id="min-value"
              type="number"
              value={min}
              onChange={(e) => onMin(e.target.value)}
              className="h-11 rounded-2xl bg-muted/30 border border-border/20 focus:ring-2 focus:ring-primary/15 focus:bg-background transition-all"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-value">{t.maxVal}</Label>
            <Input
              id="max-value"
              type="number"
              value={max}
              onChange={(e) => onMax(e.target.value)}
              className="h-11 rounded-2xl bg-muted/30 border border-border/20 focus:ring-2 focus:ring-primary/15 focus:bg-background transition-all"
            />
          </div>
        </div>
      )}

      {/* 抽取数量 */}
      <div className="space-y-2">
        <Label htmlFor="draw-count">{t.drawCount}</Label>
        <Input
          id="draw-count"
          type="number"
          min={1}
          max={1000}
          value={count}
          onChange={(e) => onCount(e.target.value)}
          className="h-11 rounded-2xl bg-muted/30 border border-border/20 focus:ring-2 focus:ring-primary/15 focus:bg-background transition-all"
        />
      </div>

      {/* 动画时长 */}
      <div className="space-y-2">
        <Label htmlFor="draw-duration">{t.duration}</Label>
        <Input
          id="draw-duration"
          type="number"
          min={1}
          max={120}
          value={duration}
          onChange={(e) => onDuration(e.target.value)}
          className="h-11 rounded-2xl bg-muted/30 border border-border/20 focus:ring-2 focus:ring-primary/15 focus:bg-background transition-all"
        />
        <p className="text-xs text-muted-foreground leading-relaxed">{t.durationHint}</p>
      </div>

      {/* 选项开关 */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between py-2 border-b border-border/20">
          <div className="space-y-0.5">
            <Label htmlFor="allow-duplicates" className="cursor-pointer text-sm font-medium">
              {t.allowDup}
            </Label>
          </div>
          <Switch
            id="allow-duplicates"
            checked={allowDuplicates}
            onCheckedChange={onAllowDuplicates}
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <Label htmlFor="auto-hide" className="cursor-pointer text-sm font-medium">
              {t.autoHide}
            </Label>
            <p className="text-xs text-muted-foreground leading-relaxed">{t.autoHideHint}</p>
          </div>
          <Switch
            id="auto-hide"
            checked={autoHide}
            onCheckedChange={onAutoHide}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: 外观设置
// ---------------------------------------------------------------------------

function AppearanceSettings({
  t,
  language,
  useCustomList,
  digits, prefix, suffix,
  onDigits, onPrefix, onSuffix,
}: {
  t: { display: string; minDigits: string; minDigitsHint: string; prefix: string; suffix: string };
  language: "zh" | "en";
  useCustomList: boolean;
  digits: number;
  prefix: string;
  suffix: string;
  onDigits: (value: number | string) => void;
  onPrefix: (value: string) => void;
  onSuffix: (value: string) => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const isZH = language === "zh";

  // 使用 theme
  const { theme, setTheme } = useTheme();
  const { preset, setPreset, font, setFont } = usePresetTheme();
  const mounted = useThemeMounted();

  const displayT = React.useMemo(() => isZH ? {
    appearance: "外观",
    themeMode: "主题模式",
    themeLight: "浅色",
    themeDark: "深色",
    themeSystem: "跟随系统",
    themePreset: "预设主题",
    fontFamily: "字体风格",
    fontSans: "无衬线",
    fontMono: "等宽",
    fontSerif: "衬线",
  } : {
    appearance: "Appearance",
    themeMode: "Mode",
    themeLight: "Light",
    themeDark: "Dark",
    themeSystem: "System",
    themePreset: "Theme Preset",
    fontFamily: "Font Family",
    fontSans: "Sans Serif",
    fontMono: "Monospace",
    fontSerif: "Serif",
  }, [isZH]);

  const presetLabels: Record<string, string> = React.useMemo(() => isZH ? {
    default: "默认",
    ocean: "海洋蓝",
    forest: "森林绿",
    sunset: "日落橙",
    purple: "梦幻紫",
    neon: "霓虹",
    sakura: "樱花粉",
    midnight: "午夜蓝",
    retro: "复古棕",
    pixel: "像素风",
  } : {
    default: "Default",
    ocean: "Ocean",
    forest: "Forest",
    sunset: "Sunset",
    purple: "Purple",
    neon: "Neon",
    sakura: "Sakura",
    midnight: "Midnight",
    retro: "Retro",
    pixel: "Pixel",
  }, [isZH]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4 }}
      className="space-y-6 pt-2"
    >
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
        {displayT.appearance}
      </p>

      {/* 主题模式 */}
      <div className="space-y-3">
        <Label htmlFor="theme-mode">{displayT.themeMode}</Label>
        {mounted && (
          <Select value={theme ?? "system"} onValueChange={(v) => setTheme(v)}>
            <SelectTrigger id="theme-mode" className="h-11 rounded-xl bg-muted/30 border border-border/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">{displayT.themeLight}</SelectItem>
              <SelectItem value="dark">{displayT.themeDark}</SelectItem>
              <SelectItem value="system">{displayT.themeSystem}</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* 主题预设 */}
      <div className="space-y-3">
        <Label htmlFor="theme-preset">{displayT.themePreset}</Label>
        <Select
          value={preset}
          onValueChange={(value) => {
            const v = (value ?? "default") as ThemePreset;
            if ((THEME_PRESETS as readonly string[]).includes(v)) setPreset(v);
          }}
        >
          <SelectTrigger id="theme-preset" className="h-11 rounded-xl bg-muted/30 border border-border/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {THEME_PRESETS.map((p) => (
              <SelectItem key={p} value={p}>
                {presetLabels[p] ?? p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 字体风格 */}
      <div className="space-y-3">
        <Label htmlFor="font-family">{displayT.fontFamily}</Label>
        <Select
          value={font}
          onValueChange={(value) => {
            const v = (value ?? "sans") as FontFamily;
            if ((FONT_FAMILIES as readonly string[]).includes(v)) setFont(v);
          }}
        >
          <SelectTrigger id="font-family" className="h-11 rounded-xl bg-muted/30 border border-border/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sans">{displayT.fontSans}</SelectItem>
            <SelectItem value="mono">{displayT.fontMono}</SelectItem>
            <SelectItem value="serif">{displayT.fontSerif}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 数字显示格式 */}
      {!useCustomList && (
        <>
          <div className="space-y-3 pt-2">
            <Label htmlFor="digits">{t.minDigits}</Label>
            <Input
              id="digits"
              type="number"
              min={0}
              max={20}
              value={digits}
              onChange={(e) => onDigits(e.target.value)}
              className="h-11 rounded-2xl bg-muted/30 border border-border/20 focus:ring-2 focus:ring-primary/15 focus:bg-background transition-all"
            />
            <p className="text-xs text-muted-foreground leading-relaxed">{t.minDigitsHint}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="prefix">{t.prefix}</Label>
              <Input
                id="prefix"
                value={prefix}
                onChange={(e) => onPrefix(e.target.value)}
                className="h-11 rounded-2xl bg-muted/30 border border-border/20 focus:ring-2 focus:ring-primary/15 focus:bg-background transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="suffix">{t.suffix}</Label>
              <Input
                id="suffix"
                value={suffix}
                onChange={(e) => onSuffix(e.target.value)}
                className="h-11 rounded-2xl bg-muted/30 border border-border/20 focus:ring-2 focus:ring-primary/15 focus:bg-background transition-all"
              />
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: 自定义列表
// ---------------------------------------------------------------------------

function CustomListSettings({
  t,
  language,
  useCustomList, customList,
  onUseCustomListChange,
  onImport,
}: {
  t: { custom: string; useCustomList: string; itemsLoaded: string; noItems: string; importList: string; exportList: string };
  language: "zh" | "en";
  useCustomList: boolean;
  customList: string[];
  onUseCustomListChange: (value: boolean) => void;
  onImport: (items: string[]) => void;
}) {
  const isZH = language === "zh";
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [importText, setImportText] = React.useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="space-y-6 pt-2"
    >
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
        {t.custom}
      </p>

      <div className="flex items-center justify-between py-3 border-b border-border/20">
        <div className="space-y-0.5">
          <Label htmlFor="use-custom" className="cursor-pointer text-sm font-medium">
            {t.useCustomList}
          </Label>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {customList.length > 0 ? `${customList.length} ${t.itemsLoaded}` : t.noItems}
          </p>
        </div>
        <Switch
          id="use-custom"
          checked={useCustomList}
          onCheckedChange={onUseCustomListChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={() => {
            setImportText(customList.join("\n"));
            setDialogOpen(true);
          }}
          className="h-11 rounded-xl hover:bg-muted/50 transition-colors border-border/30"
        >
          {t.importList}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            const data = customList.join("\n");
            if (data) {
              const blob = new Blob([data], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "custom-list.txt";
              a.style.display = "none";
              document.body.appendChild(a);
              a.click();
              // 延迟 revoke，确保浏览器完成下载后再释放 URL
              setTimeout(() => {
                URL.revokeObjectURL(url);
                document.body.removeChild(a);
              }, 200);
            }
          }}
          className="h-11 rounded-xl hover:bg-muted/50 transition-colors border-border/30"
        >
          {t.exportList}
        </Button>
      </div>

      {/* 导入 Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
        className="sm:max-w-[520px] rounded-2xl border-border/30"
        aria-label={isZH ? "导入自定义列表" : "Import custom list"}
      >
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{t.importList}</DialogTitle>
            <DialogDescription>
              {isZH ? "每行一个项目，提交后将作为抽取池" : "One item per line, will be used as the draw pool"}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder={isZH ? "苹果&#10;香蕉&#10;橙子&#10;..." : "Apple&#10;Banana&#10;Orange&#10;..."}
              className="min-h-[240px] w-full rounded-xl resize-none bg-muted/30 border border-border/20 p-4 text-sm font-mono focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
              aria-label={isZH ? "自定义列表内容（每行一项）" : "Custom list content (one per line)"}
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="flex-1 h-11 rounded-xl border-border/30"
            >
              {isZH ? "取消" : "Cancel"}
            </Button>
            <Button
              onClick={() => {
                const items = sanitizeListInput(importText);
                if (items.length > 0) {
                  onImport(items);
                }
                setDialogOpen(false);
              }}
              className="flex-1 h-11 rounded-xl"
            >
              {isZH ? "确认导入" : "Import"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
      version: isZH ? "v2.0" : "v2.0",
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
          // 适配移动端（小屏从右侧滑入）
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
