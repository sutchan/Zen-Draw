// components/draw/appearance-settings.tsx v3.1 —— 外观设置子组件（使用中央翻译系统）
"use client";

import * as React from "react";
import { motion } from "motion/react";
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
import { createTranslator } from "@/lib/i18n";
import type { TranslationKey } from "@/locales";

/** 主题预设 ID 到翻译键的映射 */
const THEME_PRESET_KEYS: Record<string, TranslationKey> = {
  default: "themeDefault",
  ocean: "themeOcean",
  forest: "themeForest",
  sunset: "themeSunset",
  purple: "themePurple",
  neon: "themeNeon",
  sakura: "themeSakura",
  midnight: "themeMidnight",
  retro: "themeRetro",
  pixel: "themePixel",
};

export function AppearanceSettings({
  language,
  useCustomList,
  digits, prefix, suffix,
  onDigits, onPrefix, onSuffix,
}: {
  language: "zh" | "en";
  useCustomList: boolean;
  digits: number;
  prefix: string;
  suffix: string;
  onDigits: (value: number | string) => void;
  onPrefix: (value: string) => void;
  onSuffix: (value: string) => void;
}) {
  const t = React.useMemo(() => createTranslator(language), [language]);

  const { theme, setTheme } = useTheme();
  const { preset, setPreset, font, setFont } = usePresetTheme();
  const mounted = useThemeMounted();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4 }}
      className="space-y-6 pt-2"
    >
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
        {t("appearance")}
      </p>

      {/* 主题模式 */}
      <div className="space-y-3">
        <Label htmlFor="theme-mode">{t("themeMode")}</Label>
        {mounted && (
          <Select value={theme ?? "system"} onValueChange={(v) => setTheme(v)}>
            <SelectTrigger id="theme-mode" className="h-11 rounded-2xl bg-muted/30 border border-border/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">{t("themeLight")}</SelectItem>
              <SelectItem value="dark">{t("themeDark")}</SelectItem>
              <SelectItem value="system">{t("themeSystem")}</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* 主题预设 */}
      <div className="space-y-3">
        <Label htmlFor="theme-preset">{t("themePreset")}</Label>
        <Select
          value={preset}
          onValueChange={(value) => {
            const v = (value ?? "default") as ThemePreset;
            if ((THEME_PRESETS as readonly string[]).includes(v)) setPreset(v);
          }}
        >
          <SelectTrigger id="theme-preset" className="h-11 rounded-2xl bg-muted/30 border border-border/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {THEME_PRESETS.map((p) => (
              <SelectItem key={p} value={p}>
                {t(THEME_PRESET_KEYS[p] ?? "themeDefault")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 字体风格 */}
      <div className="space-y-3">
        <Label htmlFor="font-family">{t("fontFamily")}</Label>
        <Select
          value={font}
          onValueChange={(value) => {
            const v = (value ?? "sans") as FontFamily;
            if ((FONT_FAMILIES as readonly string[]).includes(v)) setFont(v);
          }}
        >
          <SelectTrigger id="font-family" className="h-11 rounded-2xl bg-muted/30 border border-border/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sans">{t("fontSans")}</SelectItem>
            <SelectItem value="mono">{t("fontMono")}</SelectItem>
            <SelectItem value="serif">{t("fontSerif")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 数字显示格式 */}
      {!useCustomList && (
        <>
          <div className="space-y-3 pt-2">
            <Label htmlFor="digits">{t("minDigits")}</Label>
            <Input
              id="digits"
              type="number"
              min={0}
              max={20}
              value={digits}
              onChange={(e) => onDigits(e.target.value)}
              className="h-11 rounded-2xl bg-muted/30 border border-border/20 focus:ring-2 focus:ring-primary/15 focus:bg-background transition-all"
            />
            <p className="text-xs text-muted-foreground leading-relaxed">{t("minDigitsDesc")}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="prefix">{t("prefix")}</Label>
              <Input
                id="prefix"
                value={prefix}
                onChange={(e) => onPrefix(e.target.value)}
                className="h-11 rounded-2xl bg-muted/30 border border-border/20 focus:ring-2 focus:ring-primary/15 focus:bg-background transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="suffix">{t("suffix")}</Label>
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
