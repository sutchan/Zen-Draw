// hooks/use-draw-actions.ts v5.7.8 — 抽取动作回调（startDraw/stopDraw/设置更新方法）
"use client";

import * as React from "react";
import type { DrawSettings, DrawState, DrawAction } from "./draw-types";
import type { SoundType } from "@/hooks/use-sound";
import {
  finalizeDraw,
  generateTemporaryResults,
  toSettings,
  validateSettings,
} from "./draw-helpers";
import { createTranslator } from "@/lib/i18n";
import { useDrawSettingsActions } from "./use-draw-settings-actions";

// 动画时序常量（集中魔法数字，模块级避免每次渲染重建）
const ANIMATION = {
  /** 动画最小总时长（ms） */
  MIN_TOTAL_MS: 1000,
  /** 单次嘀嗒间隔（ms） */
  TICK_MS: 80,
  /** 每隔几次嘀嗒播放一次滴答声 */
  TICK_SOUND_EVERY: 3,
} as const;

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
  const { status, duration, soundEnabled } = state;

  // 音效门控：开关关闭时静默
  const sound = React.useCallback(
    (type: SoundType) => {
      if (soundEnabled) onSoundRef.current?.(type);
    },
    [soundEnabled, onSoundRef],
  );

  // --- 抽取核心动作 ---

  const startDraw = React.useCallback((): { ok: boolean; error?: string } => {
    const currentSettings: DrawSettings = toSettings(state);

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

    const totalMs = Math.max(ANIMATION.MIN_TOTAL_MS, duration * 1000);
    const tickMs = ANIMATION.TICK_MS;
    const totalTicks = Math.max(1, Math.floor(totalMs / tickMs));
    let ticks = 0;

    animationRef.current = window.setInterval(() => {
      ticks += 1;
      dispatch({
        type: "UPDATE_ROLLING",
        values: generateTemporaryResults(currentSettings),
      });
      // 每隔固定嘀嗒数播放一次滴答声
      if (ticks % ANIMATION.TICK_SOUND_EVERY === 0) {
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
  }, [status, duration, state, sound, dispatch, animationRef]);

  const stopDraw = React.useCallback(() => {
    if (animationRef.current !== null) {
      window.clearInterval(animationRef.current);
      animationRef.current = null;
    }
    dispatch({ type: "CANCEL" });
    sound("stop");
  }, [dispatch, animationRef, sound]);

  // 设置更新方法统一由子模块派发，保持公开回调契约稳定
  const settingsActions = useDrawSettingsActions(dispatch);

  return {
    startDraw,
    stopDraw,
    ...settingsActions,
  };
}

