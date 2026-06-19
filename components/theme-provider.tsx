// components/theme-provider.tsx v1.0 — 主题提供者
// 负责：深浅模式切换、预设主题类名、字体族切换、用户偏好持久化
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

/** 可用的主题预设 */
export const THEME_PRESETS = [
  "default",
  "ocean",
  "forest",
  "sunset",
  "purple",
  "neon",
] as const;

export type ThemePreset = (typeof THEME_PRESETS)[number];

/** 可用的字体族 */
export const FONT_FAMILIES = ["sans", "mono", "serif"] as const;
export type FontFamily = (typeof FONT_FAMILIES)[number];

/**
 * 内部工具：判断当前主题预设是否与给定值一致
 * 采用 document.documentElement.classList 检测
 */
function hasPresetClass(preset: string): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains(`theme-${preset}`);
}

function applyPresetClass(preset: ThemePreset): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  THEME_PRESETS.forEach((p) => root.classList.remove(`theme-${p}`));
  if (preset !== "default") root.classList.add(`theme-${preset}`);
}

function applyFontFamilyClass(font: FontFamily): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  FONT_FAMILIES.forEach((f) => root.classList.remove(`font-${f}`));
  // 通过 style.css 中的 util 类设置：font-sans / font-mono / font-serif
  root.classList.add(`font-${font}`);
}

/**
 * 顶层提供者：封装 next-themes
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>): React.ReactNode {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

/**
 * SSR 安全的主题挂载检测
 */
export function useThemeMounted(): boolean {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return mounted;
}

/**
 * 自定义主题预设 Hook（非深浅模式，而是色彩系统预设）
 * - 持久化到 localStorage
 * - 通过 document.documentElement 添加/移除 class 触发 CSS 变量切换
 */
export function usePresetTheme(): {
  preset: ThemePreset;
  setPreset: (p: ThemePreset) => void;
  font: FontFamily;
  setFont: (f: FontFamily) => void;
} {
  const [preset, setPresetState] = React.useState<ThemePreset>("default");
  const [font, setFontState] = React.useState<FontFamily>("sans");
  const mounted = useThemeMounted();

  // 初始化时读取 localStorage（保证 SSR 后再读取）
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedPreset = window.localStorage.getItem("zendraw-theme-preset");
      const savedFont = window.localStorage.getItem("zendraw-font-family");
      if (savedPreset && (THEME_PRESETS as readonly string[]).includes(savedPreset)) {
        setPresetState(savedPreset as ThemePreset);
      }
      if (savedFont && (FONT_FAMILIES as readonly string[]).includes(savedFont)) {
        setFontState(savedFont as FontFamily);
      }
    } catch {
      // 忽略存储异常
    }
  }, []);

  // 当预设或字体改变时，更新 DOM 类名和 localStorage
  React.useEffect(() => {
    if (!mounted) return;
    applyPresetClass(preset);
    applyFontFamilyClass(font);
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("zendraw-theme-preset", preset);
        window.localStorage.setItem("zendraw-font-family", font);
      }
    } catch {
      // 忽略存储失败
    }
  }, [preset, font, mounted]);

  // 静默处理：如果预设不存在于有效集合，回退到 default
  const setPreset = React.useCallback((p: ThemePreset) => {
    if ((THEME_PRESETS as readonly string[]).includes(p)) {
      setPresetState(p);
    } else {
      setPresetState("default");
    }
  }, []);

  const setFont = React.useCallback((f: FontFamily) => {
    if ((FONT_FAMILIES as readonly string[]).includes(f)) {
      setFontState(f);
    } else {
      setFontState("sans");
    }
  }, []);

  return { preset, setPreset, font, setFont };
}

// 保证 next-themes 能正常工作的导出别名
export { useTheme };
