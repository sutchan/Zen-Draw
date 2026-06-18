// components/theme-provider.tsx v3.1 — 扩展主题预设与字体管理
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

// 主题预设常量（避免在 page.tsx 中以字符串拼接生成类名，更利于 Tailwind 静态分析）
export const THEME_PRESETS = ["default", "ocean", "forest", "sunset", "purple", "neon"] as const;
export type ThemePreset = (typeof THEME_PRESETS)[number];
export const FONT_FAMILIES = ["sans", "mono", "serif"] as const;
export type FontFamily = (typeof FONT_FAMILIES)[number];

interface PresetThemeContextValue {
  preset: ThemePreset;
  setPreset: (p: ThemePreset) => void;
  font: FontFamily;
  setFont: (f: FontFamily) => void;
}

const PresetThemeContext = React.createContext<PresetThemeContextValue | null>(null);

/** 一次性把 theme-preset 与 fontFamily 应用到 <html> 元素上（而非 body，避免 hydration flash）。 */
function applyBodyClasses(preset: ThemePreset, font: FontFamily) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  // 移除旧预设类
  for (const p of THEME_PRESETS) {
    root.classList.remove(`theme-${p}`);
  }
  if (preset !== "default") {
    root.classList.add(`theme-${preset}`);
  }
  // 字体
  for (const f of FONT_FAMILIES) {
    root.classList.remove(`font-${f}`);
  }
  root.classList.add(`font-${font}`);
}

function PersistPresetProvider({ children }: { children: React.ReactNode }) {
  // 从 localStorage 读取预设值；使用 useSyncExternalStore 订阅 storage 事件，避免 useEffect 内同步 setState
  const [preset, setPresetState] = React.useState<ThemePreset>("default");
  const [font, setFontState] = React.useState<FontFamily>("sans");

  // useSyncExternalStore 读取 localStorage 初始值；SSR 返回 default
  const readPreset = () => {
    if (typeof window === "undefined") return "default";
    try {
      const p = window.localStorage.getItem("zendraw-theme-preset") as ThemePreset | null;
      return (p && (THEME_PRESETS as readonly string[]).includes(p)) ? p : "default";
    } catch {
      return "default";
    }
  };
  const readFont = () => {
    if (typeof window === "undefined") return "sans";
    try {
      const f = window.localStorage.getItem("zendraw-font-family") as FontFamily | null;
      return (f && (FONT_FAMILIES as readonly string[]).includes(f)) ? f : "sans";
    } catch {
      return "sans";
    }
  };
  // 订阅 storage 事件以响应跨 tab 变化
  const subscribe = (cb: () => void) => {
    if (typeof window === "undefined") return () => {};
    const onStorage = (e: StorageEvent) => {
      if (e.key === "zendraw-theme-preset" || e.key === "zendraw-font-family") cb();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  };
  const syncedPreset = React.useSyncExternalStore(subscribe, readPreset, () => "default") as ThemePreset;
  const syncedFont = React.useSyncExternalStore(subscribe, readFont, () => "sans") as FontFamily;
  // 同步到 state（setter 改变后的值会写入 localStorage，从而触发订阅回调再读回来）
  const effectivePreset = preset !== "default" ? preset : syncedPreset;
  const effectiveFont = font !== "sans" ? font : syncedFont;

  React.useEffect(() => {
    applyBodyClasses(effectivePreset, effectiveFont);
    try {
      window.localStorage.setItem("zendraw-theme-preset", effectivePreset);
      window.localStorage.setItem("zendraw-font-family", effectiveFont);
    } catch {
      /* ignore */
    }
  }, [effectivePreset, effectiveFont]);

  const value = React.useMemo<PresetThemeContextValue>(
    () => ({
      preset: effectivePreset,
      setPreset: setPresetState,
      font: effectiveFont,
      setFont: setFontState,
    }),
    [effectivePreset, effectiveFont]
  );

  return <PresetThemeContext.Provider value={value}>{children}</PresetThemeContext.Provider>;
}

export function usePresetTheme(): PresetThemeContextValue {
  const ctx = React.useContext(PresetThemeContext);
  if (!ctx) {
    throw new Error("usePresetTheme must be used within <ThemeProvider>.");
  }
  return ctx;
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <PersistPresetProvider>{children}</PersistPresetProvider>
    </NextThemesProvider>
  );
}

// 导出一个 mounted hook，供需要 SSR-safe 的组件使用
export function useThemeMounted(): boolean {
  // 触发 next-themes 上下文检查
  try {
    useTheme();
  } catch {
    /* ignore */
  }
  // 用 useSyncExternalStore 检测客户端挂载：SSR 返回 false，客户端返回 true
  return React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
