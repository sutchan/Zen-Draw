// hooks/use-draw.ts v5.7.9 —— 统一管理抽奖流程状态与逻辑（重构拆分版）
"use client";

import * as React from "react";

import type { DrawSettings, UseDrawReturn } from "./draw-types";
import { SETTINGS_FIELDS } from "./draw-types";
import type { SoundType } from "@/hooks/use-sound";
import { createInitialState, drawReducer } from "./draw-reducer";
import { toSettings } from "./draw-helpers";
import { usePersistedSettings } from "./use-draw-persistence";
import { useDrawActions } from "./use-draw-actions";

export type { DrawSettings } from "./draw-types";
export type { HistoryEntry } from "./draw-types";

// 设置字段 → 持久化绑定（值读取名 + 写入 setter）的静态映射。
// 置于模块级避免每次渲染重建。persisted* 的命名并非全部可由字段名机械派生
// （如 allowDuplicates → persistedAllowDup），故显式列出，确保读写两端一一对应。
const PERSIST_BINDING: Record<
  (typeof SETTINGS_FIELDS)[number],
  { value: string; setter: string }
> = {
  min: { value: "persistedMin", setter: "setPersistedMin" },
  max: { value: "persistedMax", setter: "setPersistedMax" },
  count: { value: "persistedCount", setter: "setPersistedCount" },
  allowDuplicates: { value: "persistedAllowDup", setter: "setPersistedAllowDup" },
  autoHide: { value: "persistedAutoHide", setter: "setPersistedAutoHide" },
  duration: { value: "persistedDuration", setter: "setPersistedDuration" },
  customList: { value: "persistedCustomList", setter: "setPersistedCustomList" },
  useCustomList: { value: "persistedUseCustom", setter: "setPersistedUseCustom" },
  digits: { value: "persistedDigits", setter: "setPersistedDigits" },
  prefix: { value: "persistedPrefix", setter: "setPersistedPrefix" },
  suffix: { value: "persistedSuffix", setter: "setPersistedSuffix" },
  language: { value: "persistedLanguage", setter: "setPersistedLanguage" },
  soundEnabled: { value: "persistedSoundEnabled", setter: "setPersistedSoundEnabled" },
  density: { value: "persistedDensity", setter: "setPersistedDensity" },
  confettiEnabled: { value: "persistedConfetti", setter: "setPersistedConfetti" },
  reduceMotion: { value: "persistedReduceMotion", setter: "setPersistedReduceMotion" },
};

export function useDraw(onSound?: (type: SoundType) => void): UseDrawReturn {
  const persisted = usePersistedSettings();

  // 构建初始 state：从持久化值还原完整设置快照。
  // 字段清单取自 SETTINGS_FIELDS，读写映射见 PERSIST_BINDING。
  // 注：useReducer 仅在挂载时消费该初始值，故无需 useMemo（persisted 每渲染皆为新对象）。
  const initialSettings: DrawSettings = (() => {
    const source = persisted as unknown as Record<string, unknown>;
    const snapshot = {} as DrawSettings;
    for (const field of SETTINGS_FIELDS) {
      (snapshot as unknown as Record<string, unknown>)[field] =
        source[PERSIST_BINDING[field].value];
    }
    return snapshot;
  })();

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
    for (const field of SETTINGS_FIELDS) {
      if (state[field] !== prev[field]) {
        const setter = persisted[
          PERSIST_BINDING[field].setter as keyof typeof persisted
        ] as (v: never) => void;
        setter(state[field] as never);
      }
    }
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

  // 设置快照：剥离运行时字段，仅保留设置项。
  // 先解构出设置字段，再交由 toSettings 组装（字段清单单一来源，见 SETTINGS_FIELDS）。
  // 依赖为字面量形式以满足 react-hooks/use-memo 规则，
  // 且仅在设置项自身变化时重建，避免抽取动画期间反复产生新引用。
  const {
    min, max, count, duration, allowDuplicates, autoHide, customList,
    useCustomList, digits, prefix, suffix, language, soundEnabled, density,
    confettiEnabled, reduceMotion,
  } = state;

  const settings = React.useMemo(
    () =>
      toSettings({
        min, max, count, duration, allowDuplicates, autoHide, customList,
        useCustomList, digits, prefix, suffix, language, soundEnabled, density,
        confettiEnabled, reduceMotion,
      }),
    [
      min, max, count, duration, allowDuplicates, autoHide, customList,
      useCustomList, digits, prefix, suffix, language, soundEnabled, density,
      confettiEnabled, reduceMotion,
    ]
  );

  return {
    ...state,
    ...actions,
    isDrawing, results, canDraw, settings,
  };
}

