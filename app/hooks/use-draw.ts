// hooks/use-draw.ts v5.2.0 —— 统一管理抽奖流程状态与逻辑（重构拆分版）
"use client";

import * as React from "react";

import type { DrawSettings, UseDrawReturn } from "./draw-types";
import type { SoundType } from "@/hooks/use-sound";
import { createInitialState, drawReducer } from "./draw-reducer";
import { usePersistedSettings } from "./use-draw-persistence";
import { useDrawActions } from "./use-draw-actions";

export type { DrawSettings } from "./draw-types";
export type { HistoryEntry } from "./draw-types";

export function useDraw(onSound?: (type: SoundType) => void): UseDrawReturn {
  const persisted = usePersistedSettings();

  // 构建初始 state
  const initialSettings: DrawSettings = {
    min: persisted.persistedMin,
    max: persisted.persistedMax,
    count: persisted.persistedCount,
    allowDuplicates: persisted.persistedAllowDup,
    autoHide: persisted.persistedAutoHide,
    duration: persisted.persistedDuration,
    customList: persisted.persistedCustomList,
    useCustomList: persisted.persistedUseCustom,
    digits: persisted.persistedDigits,
    prefix: persisted.persistedPrefix,
    suffix: persisted.persistedSuffix,
    language: persisted.persistedLanguage,
  };

  const [state, dispatch] = React.useReducer(
    drawReducer,
    { ...createInitialState(initialSettings), history: persisted.persistedHistory },
  );

  // 动画计时器引用
  const animationRef = React.useRef<number | null>(null);
  // 音效回调引用（避免 useCallback 依赖抖动）
  const onSoundRef = React.useRef(onSound);

  // 在 effect 中同步 ref，避免 render 时写 ref（React 19 规则）
  React.useEffect(() => {
    onSoundRef.current = onSound;
  }, [onSound]);

  // 当设置变化时，持久化到 localStorage（仅在 state 变化时执行）
  const prevPersistRef = React.useRef(state);
  React.useEffect(() => {
    const prev = prevPersistRef.current;
    prevPersistRef.current = state;
    if (state.min !== prev.min) persisted.setPersistedMin(state.min);
    if (state.max !== prev.max) persisted.setPersistedMax(state.max);
    if (state.count !== prev.count) persisted.setPersistedCount(state.count);
    if (state.allowDuplicates !== prev.allowDuplicates) persisted.setPersistedAllowDup(state.allowDuplicates);
    if (state.autoHide !== prev.autoHide) persisted.setPersistedAutoHide(state.autoHide);
    if (state.duration !== prev.duration) persisted.setPersistedDuration(state.duration);
    if (state.customList !== prev.customList) persisted.setPersistedCustomList(state.customList);
    if (state.useCustomList !== prev.useCustomList) persisted.setPersistedUseCustom(state.useCustomList);
    if (state.digits !== prev.digits) persisted.setPersistedDigits(state.digits);
    if (state.prefix !== prev.prefix) persisted.setPersistedPrefix(state.prefix);
    if (state.suffix !== prev.suffix) persisted.setPersistedSuffix(state.suffix);
    if (state.language !== prev.language) persisted.setPersistedLanguage(state.language);
    if (state.history !== prev.history) persisted.setPersistedHistory(state.history);
  }, [state, persisted]);

  // 组件卸载时清理动画
  React.useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        window.clearInterval(animationRef.current);
        animationRef.current = null;
      }
    };
  }, []);

  // 动作回调（startDraw、stopDraw、所有 setter 方法）
  const actions = useDrawActions(dispatch, state, animationRef, onSoundRef);

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

  return {
    ...state,
    ...actions,
    isDrawing, results, canDraw, settings,
  };
}

