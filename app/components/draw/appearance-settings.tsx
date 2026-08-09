// components/draw/appearance-settings.tsx v5.5.0 —— 外观设置子组件（使用中央翻译系统）
"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePresetTheme, useThemeMounted, type ThemePreset } from "@/components/theme-provider";
import { useTheme } from "next-themes";
import { createTranslator } from "@/lib/i18n";
import {
  ThemePresetGrid,
  FontFamilySelect,
} from "@/components/draw/appearance-settings.parts";

export function AppearanceSettings({
  language,
  digits, prefix, suffix,
  useCustomList,
  onDigits, onPrefix, onSuffix,
  onLanguageChange,
}: {
  language: "zh" | "en";
  digits: number;
  prefix: string;
  suffix: string;
  useCustomList: boolean;
  onDigits: (value: number | string) => void;
  onPrefix: (value: string) => void;
  onSuffix: (value: string) => void;
  onLanguageChange: (lang: "zh" | "en") => void;
}) {
  const t = React.useMemo(() => createTranslator(language), [language]);

  const { theme, setTheme } = useTheme();
  const { preset, setPreset, font, setFont } = usePresetTheme();
  const mounted = useThemeMounted();

  // 数字格式实时预览（自定义名单模式下数字格式不生效）
  const previewSample = React.useMemo(() => {
    if (useCustomList) return null;
    const raw = "7";
    const padded = raw.padStart(Math.max(0, digits), "0");
    return `${prefix || ""}${padded}${suffix || ""}` || "—";
  }, [digits, prefix, suffix, useCustomList]);

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
          <Select value={theme ?? "system"} onValueChange={(v) => setTheme(v as string)}>
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

      {/* 主题预设 —— 色块网格 */}
      <ThemePresetGrid language={language} preset={preset} onSelect={(p: ThemePreset) => setPreset(p)} />

      {/* 字体风格 */}
      <FontFamilySelect language={language} value={font} onChange={setFont} />

      {/* 界面语言 */}
      <div className="space-y-3">
        <Label>{t("languageLabel")}</Label>
        <div className="grid grid-cols-2 gap-2.5">
          <Button
            type="button"
            variant={language === "zh" ? "default" : "outline"}
            onClick={() => onLanguageChange("zh")}
            className="h-11 rounded-xl transition-colors"
          >
            {t("langZh")}
          </Button>
          <Button
            type="button"
            variant={language === "en" ? "default" : "outline"}
            onClick={() => onLanguageChange("en")}
            className="h-11 rounded-xl transition-colors"
          >
            {t("langEn")}
          </Button>
        </div>
      </div>

      {/* 数字显示格式 */}
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

      {/* 实时预览 */}
      <div className="rounded-2xl border border-border/20 bg-muted/20 p-4">
        <p className="text-xs font-medium text-muted-foreground mb-2">
          {useCustomList ? t("listModeFormatNote") : t("formatPreview")}
        </p>
        <p className="text-2xl font-bold tabular-nums tracking-tight">
          {previewSample ?? t("notApplicable")}
        </p>
      </div>
    </motion.div>
  );
}
