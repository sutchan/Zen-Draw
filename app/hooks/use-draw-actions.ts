// hooks/use-draw-actions.ts v3.3.0 — 抽取动作回调（startDraw/stopDraw/设置更新方法）
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
  const { status, min, max, count, allowDuplicates, autoHide, duration, customList, useCustomList, digits, prefix, suffix, language } = state;

  // --- 抽取核心动作 ---

  const startDraw = React.useCallback((): { ok: boolean; error?: string } => {
    const currentSettings: DrawSettings = {
      min, max, count,
      allowDuplicates, autoHide,
      duration, customList,
      useCustomList, digits,
      prefix, suffix, language,
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
      onSoundRef.current?.("error");
      return { ok: false, error: errorMessage };
    }

    onSoundRef.current?.("start");
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
        onSoundRef.current?.("tick");
      }
      if (ticks >= totalTicks) {
        if (animationRef.current !== null) {
          window.clearInterval(animationRef.current);
          animationRef.current = null;
        }
        const finalResults = finalizeDraw(currentSettings);
        dispatch({ type: "FINALIZE_DRAW", results: finalResults });
        onSoundRef.current?.("result");
      }
    }, tickMs);
    return { ok: true };
  }, [status, min, max, count, allowDuplicates, autoHide, duration, customList, useCustomList, digits, prefix, suffix, language, dispatch, animationRef, onSoundRef]);

  const stopDraw = React.useCallback(() => {
    if (animationRef.current !== null) {
      window.clearInterval(animationRef.current);
      animationRef.current = null;
    }
    dispatch({ type: "CANCEL" });
    onSoundRef.current?.("stop");
  }, [dispatch, animationRef, onSoundRef]);

  // --- 设置更新方法 ---

  const setMin = React.useCallback((value: number | string) => {
    const n = typeof value === "number" ? value : parseFiniteNumber(value, 0);
    dispatch({ type: "SET_MIN", value: n });
  }, [dispatch]);

  const setMax = React.useCallback((value: number | string) => {
    const n = typeof value === "number" ? value : parseFiniteNumber(value, 0);
    dispatch({ type: "SET_MAX", value: n });
  }, [dispatch]);

  const setCount = React.useCallback((value: number | string) => {
    const n = typeof value === "number" ? value : parseFiniteNumber(value, 1);
    const clamped = Math.max(1, Math.min(1000, n));
    dispatch({ type: "SET_COUNT", value: clamped });
  }, [dispatch]);

  const setDuration = React.useCallback((value: number | string) => {
    const n = typeof value === "number" ? value : parseFiniteNumber(value, 5);
    const clamped = Math.max(1, Math.min(120, n));
    dispatch({ type: "SET_DURATION", value: clamped });
  }, [dispatch]);

  const setDigits = React.useCallback((value: number | string) => {
    const n = typeof value === "number" ? value : parseFiniteNumber(value, 0);
    const clamped = Math.max(0, Math.min(20, n));
    dispatch({ type: "SET_DIGITS", value: clamped });
  }, [dispatch]);

  const setPrefix = React.useCallback((value: string) => {
    const cleaned = value.replace(/[\x00-\x1f]/g, "").slice(0, 50);
    dispatch({ type: "SET_PREFIX", value: cleaned });
  }, [dispatch]);

  const setSuffix = React.useCallback((value: string) => {
    const cleaned = value.replace(/[\x00-\x1f]/g, "").slice(0, 50);
    dispatch({ type: "SET_SUFFIX", value: cleaned });
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
    dismissError, clearHistory,
  };
}
