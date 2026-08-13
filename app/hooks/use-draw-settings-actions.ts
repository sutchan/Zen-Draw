// hooks/use-draw-settings-actions.ts v5.7.8 — 设置更新回调子模块
"use client";

import * as React from "react";
import type { DrawAction } from "./draw-types";
import { LIMITS } from "./draw-helpers";
import { parseFiniteNumber } from "@/lib/utils";
import { clamp, sanitizeTextField } from "./use-draw-utils";

/**
 * 设置更新回调子模块
 * 从 use-draw-actions.ts 拆出，集中所有「设置字段 setter」，
 * 保持派发契约（返回的方法名）与上一级 useDrawActions 完全一致。
 */
export function useDrawSettingsActions(
  dispatch: React.Dispatch<DrawAction>,
): {
  setMin: (value: number | string) => void;
  setMax: (value: number | string) => void;
  setCount: (value: number | string) => void;
  setDuration: (value: number | string) => void;
  setDigits: (value: number | string) => void;
  setPrefix: (value: string) => void;
  setSuffix: (value: string) => void;
  setAllowDuplicates: (value: boolean) => void;
  setAutoHide: (value: boolean) => void;
  setUseCustomList: (value: boolean) => void;
  setCustomList: (value: string[]) => void;
  setLanguage: (value: "zh" | "en") => void;
  setSoundEnabled: (value: boolean) => void;
  setDensity: (value: "comfortable" | "compact") => void;
  setConfettiEnabled: (value: boolean) => void;
  setReduceMotion: (value: boolean) => void;
  resetSettings: () => void;
  dismissError: () => void;
  clearHistory: () => void;
} {
  // 数值钳制：统一处理有限性校验与区间约束
  const coerceNumber = (
    value: number | string,
    fallback: number,
    lo: number,
    hi: number,
  ): number => {
    const n =
      typeof value === "number"
        ? Number.isFinite(value)
          ? value
          : fallback
        : parseFiniteNumber(value, fallback);
    return clamp(n, lo, hi);
  };

  const setMin = React.useCallback(
    (value: number | string) => {
      dispatch({ type: "SET_MIN", value: coerceNumber(value, 0, -Infinity, Infinity) });
    },
    [dispatch],
  );
  const setMax = React.useCallback(
    (value: number | string) => {
      dispatch({ type: "SET_MAX", value: coerceNumber(value, 0, -Infinity, Infinity) });
    },
    [dispatch],
  );
  const setCount = React.useCallback(
    (value: number | string) => {
      dispatch({ type: "SET_COUNT", value: coerceNumber(value, 1, 1, LIMITS.MAX_COUNT) });
    },
    [dispatch],
  );
  const setDuration = React.useCallback(
    (value: number | string) => {
      dispatch({ type: "SET_DURATION", value: coerceNumber(value, 5, 1, LIMITS.MAX_DURATION) });
    },
    [dispatch],
  );
  const setDigits = React.useCallback(
    (value: number | string) => {
      dispatch({ type: "SET_DIGITS", value: coerceNumber(value, 0, 0, LIMITS.MAX_DIGITS) });
    },
    [dispatch],
  );

  const setPrefix = React.useCallback(
    (value: string) => {
      dispatch({ type: "SET_PREFIX", value: sanitizeTextField(value) });
    },
    [dispatch],
  );
  const setSuffix = React.useCallback(
    (value: string) => {
      dispatch({ type: "SET_SUFFIX", value: sanitizeTextField(value) });
    },
    [dispatch],
  );
  const setAllowDuplicates = React.useCallback(
    (value: boolean) => {
      dispatch({ type: "SET_ALLOW_DUPLICATES", value });
    },
    [dispatch],
  );
  const setAutoHide = React.useCallback(
    (value: boolean) => {
      dispatch({ type: "SET_AUTO_HIDE", value });
    },
    [dispatch],
  );
  const setUseCustomList = React.useCallback(
    (value: boolean) => {
      dispatch({ type: "SET_USE_CUSTOM_LIST", value });
    },
    [dispatch],
  );
  const setCustomList = React.useCallback(
    (value: string[]) => {
      dispatch({ type: "SET_CUSTOM_LIST", value });
    },
    [dispatch],
  );
  const setLanguage = React.useCallback(
    (value: "zh" | "en") => {
      dispatch({ type: "SET_LANGUAGE", value });
    },
    [dispatch],
  );
  const setSoundEnabled = React.useCallback(
    (value: boolean) => {
      dispatch({ type: "SET_SOUND_ENABLED", value });
    },
    [dispatch],
  );
  const setDensity = React.useCallback(
    (value: "comfortable" | "compact") => {
      dispatch({ type: "SET_DENSITY", value });
    },
    [dispatch],
  );
  const setConfettiEnabled = React.useCallback(
    (value: boolean) => {
      dispatch({ type: "SET_CONFETTI_ENABLED", value });
    },
    [dispatch],
  );
  const setReduceMotion = React.useCallback(
    (value: boolean) => {
      dispatch({ type: "SET_REDUCE_MOTION", value });
    },
    [dispatch],
  );
  const resetSettings = React.useCallback(() => {
    dispatch({ type: "RESET_SETTINGS" });
  }, [dispatch]);
  const dismissError = React.useCallback(() => {
    dispatch({ type: "DISMISS_ERROR" });
  }, [dispatch]);
  const clearHistory = React.useCallback(() => {
    dispatch({ type: "CLEAR_HISTORY" });
  }, [dispatch]);

  return {
    setMin,
    setMax,
    setCount,
    setDuration,
    setDigits,
    setPrefix,
    setSuffix,
    setAllowDuplicates,
    setAutoHide,
    setUseCustomList,
    setCustomList,
    setLanguage,
    setSoundEnabled,
    setDensity,
    setConfettiEnabled,
    setReduceMotion,
    resetSettings,
    dismissError,
    clearHistory,
  };
}
