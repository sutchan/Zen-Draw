// hooks/use-draw-actions.ts v5.7.4 — 抽取动作回调（startDraw/stopDraw/设置更新方法）
"use client";

import * as React from "react";
import type { DrawSettings, DrawState, DrawAction } from "./draw-types";
import type { SoundType } from "@/hooks/use-sound";
import {
  finalizeDraw,
  generateTemporaryResults,
  validateSettings,
} from "./draw-helpers";
import { parseFiniteNumber } from "@/lib/utils";
import { createTranslator } from "@/lib/i18n";
import { clamp, sanitizeTextField } from "./use-draw-utils";

/**
 * 抽取动作回调 Hook
 * 从 use-draw.ts 中拆出，管理所有 action dispatch 回调
 */
export function useDrawActions(
  dispatch: React.Dispatch<DrawAction>,
  state: DrawState,
  animationRef: React.MutableRefObject<number | null>,
  onSoundRef: React.MutableRefObject<((type: SoundType) => void) | undefined>,
) {
  const { status, min, max, count, allowDuplicates, autoHide, duration, customList, useCustomList, digits, prefix, suffix, language, soundEnabled, density, confettiEnabled, reduceMotion } = state;

  // 音效门控：开关关闭时静默
  const sound = React.useCallback(
    (type: SoundType) => {
      if (soundEnabled) onSoundRef.current?.(type);
    },
    [soundEnabled, onSoundRef],
  );

  // --- 抽取核心动作 ---

  const startDraw = React.useCallback((): { ok: boolean; error?: string } => {
    const currentSettings: DrawSettings = {
      min, max, count,
      allowDuplicates, autoHide,
      duration, customList,
      useCustomList, digits,
      prefix, suffix, language,
      soundEnabled, density,
      confettiEnabled, reduceMotion,
    };

    if (status === "drawing") {
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
      const _t = createTranslator(currentSettings.language);
      const errorMessage = _t(error);
      dispatch({ type: "ERROR", message: errorMessage });
      sound("error");
      return { ok: false, error: errorMessage };
    }

    sound("start");
    dispatch({ type: "START_DRAW" });

    const totalMs = Math.max(1000, duration * 1000);
    const tickMs = 80;
    const totalTicks = Math.max(1, Math.floor(totalMs / tickMs));
    let ticks = 0;

    animationRef.current = window.setInterval(() => {
      ticks += 1;
      dispatch({
        type: "UPDATE_ROLLING",
        values: generateTemporaryResults(currentSettings),
      });
      // 每 3 次嘀嗒（约 240ms）播放一次滴答声
      if (ticks % 3 === 0) {
        sound("tick");
      }
      if (ticks >= totalTicks) {
        if (animationRef.current !== null) {
          window.clearInterval(animationRef.current);
          animationRef.current = null;
        }
        const finalResults = finalizeDraw(currentSettings);
        dispatch({ type: "FINALIZE_DRAW", results: finalResults });
        sound("result");
      }
    }, tickMs);
    return { ok: true };
  }, [status, min, max, count, allowDuplicates, autoHide, duration, customList, useCustomList, digits, prefix, suffix, language, soundEnabled, density, confettiEnabled, reduceMotion, sound, dispatch, animationRef]);

  const stopDraw = React.useCallback(() => {
    if (animationRef.current !== null) {
      window.clearInterval(animationRef.current);
      animationRef.current = null;
    }
    dispatch({ type: "CANCEL" });
    sound("stop");
  }, [dispatch, animationRef, sound]);

  // --- 设置更新方法 ---

  // 数值钳制：统一处理有限性校验与区间约束
  const coerceNumber = (value: number | string, fallback: number, lo: number, hi: number): number => {
    const n = typeof value === "number"
      ? (Number.isFinite(value) ? value : fallback)
      : parseFiniteNumber(value, fallback);
    return clamp(n, lo, hi);
  };

  const setMin = React.useCallback((value: number | string) => {
    dispatch({ type: "SET_MIN", value: coerceNumber(value, 0, -Infinity, Infinity) });
  }, [dispatch]);
  const setMax = React.useCallback((value: number | string) => {
    dispatch({ type: "SET_MAX", value: coerceNumber(value, 0, -Infinity, Infinity) });
  }, [dispatch]);
  const setCount = React.useCallback((value: number | string) => {
    dispatch({ type: "SET_COUNT", value: coerceNumber(value, 1, 1, 1000) });
  }, [dispatch]);
  const setDuration = React.useCallback((value: number | string) => {
    dispatch({ type: "SET_DURATION", value: coerceNumber(value, 5, 1, 30) });
  }, [dispatch]);
  const setDigits = React.useCallback((value: number | string) => {
    dispatch({ type: "SET_DIGITS", value: coerceNumber(value, 0, 0, 20) });
  }, [dispatch]);

  const setPrefix = React.useCallback((value: string) => {
    dispatch({ type: "SET_PREFIX", value: sanitizeTextField(value) });
  }, [dispatch]);

  const setSuffix = React.useCallback((value: string) => {
    dispatch({ type: "SET_SUFFIX", value: sanitizeTextField(value) });
  }, [dispatch]);

  const setAllowDuplicates = React.useCallback((value: boolean) => {
    dispatch({ type: "SET_ALLOW_DUPLICATES", value });
  }, [dispatch]);

  const setAutoHide = React.useCallback((value: boolean) => {
    dispatch({ type: "SET_AUTO_HIDE", value });
  }, [dispatch]);

  const setUseCustomList = React.useCallback((value: boolean) => {
    dispatch({ type: "SET_USE_CUSTOM_LIST", value });
  }, [dispatch]);

  const setCustomList = React.useCallback((value: string[]) => {
    dispatch({ type: "SET_CUSTOM_LIST", value });
  }, [dispatch]);

  const setLanguage = React.useCallback((value: "zh" | "en") => {
    dispatch({ type: "SET_LANGUAGE", value });
  }, [dispatch]);

  const setSoundEnabled = React.useCallback((value: boolean) => {
    dispatch({ type: "SET_SOUND_ENABLED", value });
  }, [dispatch]);

  const setDensity = React.useCallback((value: "comfortable" | "compact") => {
    dispatch({ type: "SET_DENSITY", value });
  }, [dispatch]);

  const setConfettiEnabled = React.useCallback((value: boolean) => {
    dispatch({ type: "SET_CONFETTI_ENABLED", value });
  }, [dispatch]);

  const setReduceMotion = React.useCallback((value: boolean) => {
    dispatch({ type: "SET_REDUCE_MOTION", value });
  }, [dispatch]);

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
    startDraw, stopDraw,
    setMin, setMax, setCount, setDuration, setDigits,
    setPrefix, setSuffix,
    setAllowDuplicates, setAutoHide,
    setUseCustomList, setCustomList, setLanguage,
    setSoundEnabled, setDensity, setConfettiEnabled, setReduceMotion, resetSettings,
    dismissError, clearHistory,
  };
}

