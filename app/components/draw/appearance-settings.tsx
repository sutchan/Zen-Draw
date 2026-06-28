// components/draw/appearance-settings.tsx v3.0 —— 外观设置子组件
"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  usePresetTheme,
  useThemeMounted,
  THEME_PRESETS,
  FONT_FAMILIES,
  type ThemePreset,
  type FontFamily,
} from "@/components/theme-provider";
import { useTheme } from "next-themes";

export function AppearanceSettings({
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
