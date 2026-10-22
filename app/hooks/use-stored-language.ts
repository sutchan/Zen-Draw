// app/hooks/use-stored-language.ts v5.7.7 —— 读取持久化语言偏好的钩子
//
// error.tsx / not-found.tsx 位于错误边界，拿不到 useDraw 的 language，
// 需要独立读取 localStorage 中的语言偏好（key: zendraw-language）。
//
// 用 useSyncExternalStore 而非 useState + useEffect：
//   - getServerSnapshot 固定返回 "zh"，SSR 与水合首帧一致，无 hydration 报错
//   - 挂载后读取真实偏好，无需在 effect 里 setState（避免 react-hooks/set-state-in-effect）
//   - 订阅 storage 事件，其他标签页修改语言时本页同步更新
"use client";

import * as React from "react";
import type { Language } from "@/locales/types";

const LANG_KEY = "zendraw-language";

function getLangSnapshot(): Language {
  return window.localStorage.getItem(LANG_KEY) === "en" ? "en" : "zh";
}

function getLangServerSnapshot(): Language {
  return "zh";
}

function subscribeLang(onStoreChange: () => void): () => void {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

export function useStoredLanguage(): Language {
  return React.useSyncExternalStore(
    subscribeLang,
    getLangSnapshot,
    getLangServerSnapshot,
  );
}
