// components/theme-provider.tsx v1.1 — 主题提供者（修复 React 19 set-state-in-effect 警告）
// 负责：深浅模式切换、预设主题、字体族、用户偏好持久化
"use client";

// 顶部添加导入（用于 useSyncExternalStore 兼容）
import * as React from "react";
import { useSyncExternalStore } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

export const THEME_PRESETS = [
  "default",
  "ocean",
  "forest",
  "sunset",
  "purple",
  "neon",
  "sakura",
  "midnight",
  "retro",
  "pixel",
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
 * - 通过 useSyncExternalStore 实现安全的客户端判断
 * - 服务端快照返回 false，客户端快照在 hydrate 后返回 true
 * - 完全避免在 effect / 渲染期间读写 ref 或 setState
 */
const noopSubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function useThemeMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    getClientSnapshot,
    getServerSnapshot
  );
}

/**
 * 自定义主题预设 Hook
 * - 通过 useState 惰性初始化读取 localStorage，避免在 effect 中 setState
 * - 写入持久化发生在状态变更回调与 effect 中（只写外部存储，不触发重渲染）
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

  // 挂载与值变化时将预设/字体类名同步到 DOM（外部副作用，不涉及 React 状态）
  React.useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      applyPresetClass(preset);
      applyFontFamilyClass(font);
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [preset, font]);

  // 主题变化时写入持久化（只写外部存储，避免同步渲染警告）
  React.useEffect(() => {
    writeStorage("zendraw-theme-preset", preset);
    writeStorage("zendraw-font-family", font);
  }, [preset, font]);

  const setPreset = React.useCallback((p: ThemePreset) => {
    const next = (THEME_PRESETS as readonly string[]).includes(p)
      ? p
      : "default";
    setPresetState(next);
  }, []);

  const setFont = React.useCallback((f: FontFamily) => {
    const next = (FONT_FAMILIES as readonly string[]).includes(f)
      ? f
      : "sans";
    setFontState(next);
  }, []);

  return { preset, setPreset, font, setFont };
}

export { useTheme };
