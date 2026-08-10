// components/draw/appearance-settings.parts.tsx v5.7.4 —— 外观设置：常量与子组件
import * as React from "react";
import { Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  THEME_PRESETS,
  FONT_FAMILIES,
  type ThemePreset,
  type FontFamily,
} from "@/components/theme-provider";
import { createTranslator } from "@/lib/i18n";
import type { TranslationKey } from "@/locales";

/** 主题预设 ID 到翻译键的映射 */
export const THEME_PRESET_KEYS: Record<string, TranslationKey> = {
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
  rose: "themeRose",
};

/** 主题预设代表色（浅色 primary），用于色块预览 */
export const THEME_SWATCHES: Record<string, string> = {
  default: "oklch(0.5 0 0)",
  ocean: "oklch(0.62 0.17 230)",
  forest: "oklch(0.5 0.14 150)",
  sunset: "oklch(0.62 0.2 35)",
  purple: "oklch(0.55 0.2 290)",
  neon: "oklch(0.7 0.22 320)",
  sakura: "oklch(0.7 0.18 350)",
  midnight: "oklch(0.6 0.18 250)",
  retro: "oklch(0.55 0.13 60)",
  pixel: "oklch(0.6 0.2 200)",
  rose: "oklch(0.58 0.22 15)",
};

/** 简单的类名合并工具 */
export function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** 主题预设色块网格 */
export function ThemePresetGrid({
  language,
  preset,
  onSelect,
}: {
  language: "zh" | "en";
  preset: string;
  onSelect: (preset: ThemePreset) => void;
}) {
  const t = React.useMemo(() => createTranslator(language), [language]);
  return (
    <div id="theme-preset-grid" className="space-y-3">
      <Label>{t("themePreset")}</Label>
      <div className="grid grid-cols-4 gap-2.5">
        {THEME_PRESETS.map((p) => {
          const active = p === preset;
          return (
            <button
              key={p}
              type="button"
              onClick={() => {
                const v = p as ThemePreset;
                if ((THEME_PRESETS as readonly string[]).includes(v)) onSelect(v);
              }}
              aria-pressed={active}
              aria-label={t(THEME_PRESET_KEYS[p] ?? "themeDefault")}
              title={t(THEME_PRESET_KEYS[p] ?? "themeDefault")}
              className={cn(
                "relative flex flex-col items-stretch gap-1.5 rounded-xl border p-1.5 transition-all",
                active
                  ? "border-primary ring-2 ring-primary/20 bg-muted/40"
                  : "border-border/30 hover:border-primary/40 hover:bg-muted/20"
              )}
            >
              <span
                className="h-7 w-full rounded-md"
                style={{ background: THEME_SWATCHES[p] ?? "oklch(0.5 0 0)" }}
                aria-hidden="true"
              />
              <span className="truncate text-[10px] leading-tight text-muted-foreground text-center">
                {t(THEME_PRESET_KEYS[p] ?? "themeDefault")}
              </span>
              {active && (
                <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-3" aria-hidden="true" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** 字体风格选择 */
export function FontFamilySelect({
  language,
  value,
  onChange,
}: {
  language: "zh" | "en";
  value: string;
  onChange: (font: FontFamily) => void;
}) {
  const t = React.useMemo(() => createTranslator(language), [language]);
  return (
    <div id="font-family-select" className="space-y-3">
      <Label htmlFor="font-family">{t("fontFamily")}</Label>
      <Select
        value={value}
        onValueChange={(v) => {
          const font = (v ?? "sans") as FontFamily;
          if ((FONT_FAMILIES as readonly string[]).includes(font)) onChange(font);
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
  );
}
