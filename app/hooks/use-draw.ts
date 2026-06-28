// hooks/use-draw.ts v3.0 —— 统一管理抽取流程状态与逻辑（重构拆分版）
"use client";

import * as React from "react";

import type { DrawSettings, UseDrawReturn } from "./draw-types";
import {
  finalizeDraw,
  generateTemporaryResults,
  validateSettings,
} from "./draw-helpers";
import { createInitialState, drawReducer } from "./draw-reducer";
import { useLocalStorage } from "@/hooks/use-local-storage";

// ---------------------------------------------------------------------------
// 常量
// ---------------------------------------------------------------------------

const DEFAULT_SETTINGS: DrawSettings = {
  min: 1,
  max: 100,
  count: 1,
  allowDuplicates: true,
  autoHide: true,
  duration: 5,
  customList: [],
  useCustomList: false,
  digits: 3,
  prefix: "",
  suffix: "",
  language: "zh",
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export type { DrawSettings } from "./draw-types";
export type { HistoryEntry } from "./draw-types";

export function useDraw(): UseDrawReturn {
  // 持久化设置（从 localStorage 加载）
  const [persistedMin, setPersistedMin] = useLocalStorage<number>("zendraw-min", DEFAULT_SETTINGS.min);
  const [persistedMax, setPersistedMax] = useLocalStorage<number>("zendraw-max", DEFAULT_SETTINGS.max);
  const [persistedCount, setPersistedCount] = useLocalStorage<number>("zendraw-count", DEFAULT_SETTINGS.count);
  const [persistedAllowDup, setPersistedAllowDup] = useLocalStorage<boolean>("zendraw-duplicates", DEFAULT_SETTINGS.allowDuplicates);
  const [persistedAutoHide, setPersistedAutoHide] = useLocalStorage<boolean>("zendraw-autohide", DEFAULT_SETTINGS.autoHide);
  const [persistedDuration, setPersistedDuration] = useLocalStorage<number>("zendraw-duration", DEFAULT_SETTINGS.duration);
  const [persistedCustomList, setPersistedCustomList] = useLocalStorage<string[]>("zendraw-custom-list", DEFAULT_SETTINGS.customList);
  const [persistedUseCustom, setPersistedUseCustom] = useLocalStorage<boolean>("zendraw-use-custom", DEFAULT_SETTINGS.useCustomList);
  const [persistedDigits, setPersistedDigits] = useLocalStorage<number>("zendraw-digits", DEFAULT_SETTINGS.digits);
  const [persistedPrefix, setPersistedPrefix] = useLocalStorage<string>("zendraw-prefix", DEFAULT_SETTINGS.prefix);
  const [persistedSuffix, setPersistedSuffix] = useLocalStorage<string>("zendraw-suffix", DEFAULT_SETTINGS.suffix);
  const [persistedLanguage, setPersistedLanguage] = useLocalStorage<"zh" | "en">("zendraw-language", DEFAULT_SETTINGS.language);
  const [persistedHistory, setPersistedHistory] = useLocalStorage<import("./draw-types").HistoryEntry[]>("zendraw-history", []);

  // 构建初始 state
  const initialSettings: DrawSettings = {
    min: persistedMin,
    max: persistedMax,
    count: persistedCount,
    allowDuplicates: persistedAllowDup,
    autoHide: persistedAutoHide,
    duration: persistedDuration,
    customList: persistedCustomList,
    useCustomList: persistedUseCustom,
    digits: persistedDigits,
    prefix: persistedPrefix,
    suffix: persistedSuffix,
    language: persistedLanguage,
  };

  const [state, dispatch] = React.useReducer(
    drawReducer,
    initialSettings,
    createInitialState
  );

  // 动画计时器引用
  const animationRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  // 当设置变化时，持久化到 localStorage
  React.useEffect(() => { setPersistedMin(state.min); }, [state.min]);
  React.useEffect(() => { setPersistedMax(state.max); }, [state.max]);
  React.useEffect(() => { setPersistedCount(state.count); }, [state.count]);
  React.useEffect(() => { setPersistedAllowDup(state.allowDuplicates); }, [state.allowDuplicates]);
  React.useEffect(() => { setPersistedAutoHide(state.autoHide); }, [state.autoHide]);
  React.useEffect(() => { setPersistedDuration(state.duration); }, [state.duration]);
  React.useEffect(() => { setPersistedCustomList(state.customList); }, [state.customList]);
  React.useEffect(() => { setPersistedUseCustom(state.useCustomList); }, [state.useCustomList]);
  React.useEffect(() => { setPersistedDigits(state.digits); }, [state.digits]);
  React.useEffect(() => { setPersistedPrefix(state.prefix); }, [state.prefix]);
  React.useEffect(() => { setPersistedSuffix(state.suffix); }, [state.suffix]);
  React.useEffect(() => { setPersistedLanguage(state.language); }, [state.language]);
  React.useEffect(() => { setPersistedHistory(state.history); }, [state.history]);

  // --- 抽取核心动作 ---

  const startDraw = React.useCallback((): { ok: boolean; error?: string } => {
    const currentSettings: DrawSettings = {
      min: state.min, max: state.max, count: state.count,
      allowDuplicates: state.allowDuplicates, autoHide: state.autoHide,
      duration: state.duration, customList: state.customList,
      useCustomList: state.useCustomList, digits: state.digits,
      prefix: state.prefix, suffix: state.suffix, language: state.language,
    };

    if (state.status === "drawing") {
      if (animationRef.current !== null) {
        window.clearInterval(animationRef.current);
        animationRef.current = null;
      }
      const results = finalizeDraw(currentSettings);
      dispatch({ type: "FINALIZE_DRAW", results });
      return { ok: true };
    }

    const error = validateSettings(currentSettings);
    if (error) {
      dispatch({ type: "ERROR", message: error });
      return { ok: false, error };
    }

    dispatch({ type: "START_DRAW" });

    const totalMs = Math.max(1000, state.duration * 1000);
    const tickMs = 80;
    const totalTicks = Math.max(1, Math.floor(totalMs / tickMs));
    let ticks = 0;

    animationRef.current = window.setInterval(() => {
      ticks += 1;
      dispatch({
        type: "UPDATE_ROLLING",
        values: generateTemporaryResults(currentSettings),
      });
      if (ticks >= totalTicks) {
        if (animationRef.current !== null) {
          window.clearInterval(animationRef.current);
          animationRef.current = null;
        }
        const finalResults = finalizeDraw(currentSettings);
        dispatch({ type: "FINALIZE_DRAW", results: finalResults });
      }
    }, tickMs);
    return { ok: true };
  }, [state.status, state.min, state.max, state.count, state.allowDuplicates, state.autoHide, state.duration, state.customList, state.useCustomList, state.digits, state.prefix, state.suffix]);

  const stopDraw = React.useCallback(() => {
    if (animationRef.current !== null) {
      window.clearInterval(animationRef.current);
      animationRef.current = null;
    }
    dispatch({ type: "CANCEL" });
  }, []);

  React.useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        window.clearInterval(animationRef.current);
        animationRef.current = null;
      }
    };
  }, []);

  // --- 设置更新方法 ---
  const setMin = React.useCallback((value: number | string) => {
    const n = typeof value === "number" ? value : parseFiniteNumber(value, 0);
    dispatch({ type: "SET_MIN", value: n });
  }, []);

  const setMax = React.useCallback((value: number | string) => {
    const n = typeof value === "number" ? value : parseFiniteNumber(value, 0);
    dispatch({ type: "SET_MAX", value: n });
  }, []);

  const setCount = React.useCallback((value: number | string) => {
    const n = typeof value === "number" ? value : parseFiniteNumber(value, 1);
    const clamped = Math.max(1, Math.min(1000, n));
    dispatch({ type: "SET_COUNT", value: clamped });
  }, []);

  const setDuration = React.useCallback((value: number | string) => {
    const n = typeof value === "number" ? value : parseFiniteNumber(value, 5);
    const clamped = Math.max(1, Math.min(120, n));
    dispatch({ type: "SET_DURATION", value: clamped });
  }, []);

  const setDigits = React.useCallback((value: number | string) => {
    const n = typeof value === "number" ? value : parseFiniteNumber(value, 0);
    const clamped = Math.max(0, Math.min(20, n));
    dispatch({ type: "SET_DIGITS", value: clamped });
  }, []);

  const setPrefix = React.useCallback((value: string) => {
    const cleaned = value.replace(/[\x00-\x1f]/g, "").slice(0, 50);
    dispatch({ type: "SET_PREFIX", value: cleaned });
  }, []);

  const setSuffix = React.useCallback((value: string) => {
    const cleaned = value.replace(/[\x00-\x1f]/g, "").slice(0, 50);
    dispatch({ type: "SET_SUFFIX", value: cleaned });
  }, []);

  const setAllowDuplicates = React.useCallback((value: boolean) => {
    dispatch({ type: "SET_ALLOW_DUPLICATES", value });
  }, []);

  const setAutoHide = React.useCallback((value: boolean) => {
    dispatch({ type: "SET_AUTO_HIDE", value });
  }, []);

  const setUseCustomList = React.useCallback((value: boolean) => {
    dispatch({ type: "SET_USE_CUSTOM_LIST", value });
  }, []);

  const setCustomList = React.useCallback((value: string[]) => {
    dispatch({ type: "SET_CUSTOM_LIST", value });
  }, []);

  const setLanguage = React.useCallback((value: "zh" | "en") => {
    dispatch({ type: "SET_LANGUAGE", value });
  }, []);

  const dismissError = React.useCallback(() => {
    dispatch({ type: "DISMISS_ERROR" });
  }, []);

  const clearHistory = React.useCallback(() => {
    dispatch({ type: "CLEAR_HISTORY" });
  }, []);

  // --- 计算属性 ---
  const isDrawing = state.status === "drawing";
  const results =
    state.rollingValues.length > 0 ? state.rollingValues : state.currentResults;
  const canDraw = state.status === "idle" || state.status === "result";

  const settings = {
    min: state.min, max: state.max, count: state.count,
    duration: state.duration, allowDuplicates: state.allowDuplicates,
    autoHide: state.autoHide, customList: state.customList,
    useCustomList: state.useCustomList, digits: state.digits,
    prefix: state.prefix, suffix: state.suffix, language: state.language,
  };

  const setHistory = React.useCallback(
    (updater: (prev: import("./draw-types").HistoryEntry[]) => import("./draw-types").HistoryEntry[]) => {
      const newHistory = updater(state.history);
      dispatch({ type: "SET_HISTORY", value: newHistory.slice(0, 100) });
    },
    [state.history]
  );

  return {
    ...state,
    startDraw, stopDraw, dismissError, clearHistory,
    setHistory,
    setMin, setMax, setCount, setDuration, setDigits,
    setPrefix, setSuffix,
    setAllowDuplicates, setAutoHide,
    setUseCustomList, setCustomList, setLanguage,
    isDrawing, results, canDraw, settings,
  };
}

function parseFiniteNumber(input: string, fallback: number): number {
  const n = Number(input);
  return Number.isFinite(n) ? n : fallback;
}
