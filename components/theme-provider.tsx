// components/theme-provider.tsx v1.1 — 主题提供者（修复 React 19 set-state-in-effect 警告）
// 负责：深浅模式切换、预设主题、字体族、用户偏好持久化
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

export const THEME_PRESETS = [
  "default",
  "ocean",
  "forest",
  "sunset",
  "purple",
  "neon",
] as const;

export type ThemePreset = (typeof THEME_PRESETS)[number];

export const FONT_FAMILIES = ["sans", "mono", "serif"] as const;
export type FontFamily = (typeof FONT_FAMILIES)[number];

/** 从 localStorage 安全读取值 */
function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
}

/** 写入 localStorage 工具 */
function writeStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 静默忽略存储异常
  }
}

/** 应用主题预设到根元素 */
function applyPresetClass(preset: ThemePreset): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  THEME_PRESETS.forEach((p) => root.classList.remove(`theme-${p}`));
  if (preset !== "default") root.classList.add(`theme-${preset}`);
}

/** 应用字体族到根元素 */
function applyFontFamilyClass(font: FontFamily): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  FONT_FAMILIES.forEach((f) => root.classList.remove(`font-${f}`));
  root.classList.add(`font-${font}`);
}

/** 顶层提供者：封装 next-themes */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>): React.ReactNode {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

/**
 * SSR 安全的主题挂载检测
 * 使用 ref + 单轮渲染模式避免 set-state-in-effect
 */
export function useThemeMounted(): boolean {
  const [mounted, setMounted] = React.useState<boolean>(() => {
    // 首次渲染时：如果已经在客户端可以直接为 true
    return typeof window !== "undefined";
  });
  const didSetRef = React.useRef<boolean>(false);
  React.useEffect(() => {
    if (!didSetRef.current && !mounted) {
      didSetRef.current = true;
      setMounted(true);
    }
  }, [mounted]);
  return mounted;
}

/**
 * 自定义主题预设 Hook
 * - 状态通过事件回调而非同步 setState
 * - 持久化到 localStorage（写入发生在状态变更的回调中）
 */
export function usePresetTheme(): {
  preset: ThemePreset;
  setPreset: (p: ThemePreset) => void;
  font: FontFamily;
  setFont: (f: FontFamily) => void;
} {
  const [preset, setPresetState] = React.useState<ThemePreset>(() => {
    const saved = readStorage<string>("zendraw-theme-preset", "default");
    return (THEME_PRESETS as readonly string[]).includes(saved)
      ? (saved as ThemePreset)
      : "default";
  });

  const [font, setFontState] = React.useState<FontFamily>(() => {
    const saved = readStorage<string>("zendraw-font-family", "sans");
    return (FONT_FAMILIES as readonly string[]).includes(saved)
      ? (saved as FontFamily)
      : "sans";
  });

  // 首次挂载后同步到 DOM（通过 requestAnimationFrame 避免同步渲染警告）
  React.useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      applyPresetClass(preset);
      applyFontFamilyClass(font);
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [preset, font]);

  // 主题变化时写入持久化（仅一次 per change）
  React.useEffect(() => {
    writeStorage("zendraw-theme-preset", preset);
    writeStorage("zendraw-font-family", font);
  }, [preset, font]);

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

export { useTheme };
