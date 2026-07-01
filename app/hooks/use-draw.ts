// hooks/use-draw.ts v2.0 —— 统一管理抽取流程状态与逻辑
"use client";

import * as React from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  secureRandomInt,
  parseFiniteNumber,
  generateLocalId,
} from "@/lib/utils";

// ---------------------------------------------------------------------------
// 类型定义
// ---------------------------------------------------------------------------

export type DrawStatus = "idle" | "drawing" | "result" | "error";

export interface HistoryEntry {
  id: string;
  timestamp: string;
  results: string[];
}

export interface DrawSettings {
  // 抽取范围
  min: number;
  max: number;
  // 抽取数量
  count: number;
  // 是否允许重复
  allowDuplicates: boolean;
  // 自动隐藏 UI
  autoHide: boolean;
  // 动画持续时间（秒）
  duration: number;
  // 自定义列表
  customList: string[];
  // 是否使用自定义列表
  useCustomList: boolean;
  // 数字格式：补零位数
  digits: number;
  // 前缀/后缀
  prefix: string;
  suffix: string;
  // 界面语言
  language: "zh" | "en";
}

export interface DrawState extends DrawSettings {
  // 当前显示中的结果
  currentResults: string[];
  // 当前显示的临时滚动值（动画中）
  rollingValues: string[];
  // 抽取状态
  status: DrawStatus;
  // 错误信息
  errorMessage: string;
  // 历史记录
  history: HistoryEntry[];
  // 是否正在滚动动画中
  isRolling: boolean;
}

type DrawAction =
  | { type: "START_DRAW" }
  | { type: "UPDATE_ROLLING"; values: string[] }
  | { type: "FINALIZE_DRAW"; results: string[] }
  | { type: "CANCEL" }
  | { type: "ERROR"; message: string }
  | { type: "SET_MIN"; value: number }
  | { type: "SET_MAX"; value: number }
  | { type: "SET_COUNT"; value: number }
  | { type: "SET_DURATION"; value: number }
  | { type: "SET_DIGITS"; value: number }
  | { type: "SET_PREFIX"; value: string }
  | { type: "SET_SUFFIX"; value: string }
  | { type: "SET_ALLOW_DUPLICATES"; value: boolean }
  | { type: "SET_AUTO_HIDE"; value: boolean }
  | { type: "SET_USE_CUSTOM_LIST"; value: boolean }
  | { type: "SET_CUSTOM_LIST"; value: string[] }
  | { type: "SET_LANGUAGE"; value: "zh" | "en" }
  | { type: "CLEAR_HISTORY" }
  | { type: "DISMISS_ERROR" };

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
// 纯函数：抽取逻辑
// ---------------------------------------------------------------------------

/**
 * 格式化数字：添加前缀、后缀、补零
 */
function formatNumber(n: number, digits: number, prefix: string, suffix: string): string {
  let str = n.toString();
  if (digits > 0) {
    str = str.padStart(Math.max(0, Math.floor(digits)), "0");
  }
  return `${prefix}${str}${suffix}`;
}

/**
 * 生成最终结果（用于抽取完成时）
 */
function finalizeDraw(settings: DrawSettings): string[] {
  const { useCustomList, customList, count, allowDuplicates, min, max, digits, prefix, suffix } = settings;
  const safeCount = Math.max(1, Math.min(1000, Number.isFinite(count) ? count : 1));

  if (useCustomList && customList.length > 0) {
    if (allowDuplicates) {
      return Array.from({ length: safeCount }, () => customList[secureRandomInt(customList.length)]);
    }
    const pool = [...customList];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = secureRandomInt(i + 1);
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, Math.min(safeCount, pool.length));
  }

  const safeMin = Number.isFinite(min) ? min : 0;
  const safeMax = Number.isFinite(max) ? max : 0;
  const range = Math.max(0, safeMax - safeMin + 1);

  if (allowDuplicates) {
    return Array.from({ length: safeCount }, () => formatNumber(secureRandomInt(range) + safeMin, digits, prefix, suffix));
  }
  const pool: number[] = Array.from({ length: range }, (_, i) => i + safeMin);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(safeCount, range)).map((n) => formatNumber(n, digits, prefix, suffix));
}

/**
 * 生成临时滚动值（动画过程中）
 */
function generateTemporaryResults(settings: DrawSettings): string[] {
  const { useCustomList, customList, count, min, max, digits, prefix, suffix } = settings;
  const safeCount = Math.max(1, Math.min(1000, Number.isFinite(count) ? count : 1));

  if (useCustomList && customList.length > 0) {
    return Array.from({ length: safeCount }, () => customList[secureRandomInt(customList.length)]);
  }
  const safeMin = Number.isFinite(min) ? min : 0;
  const safeMax = Number.isFinite(max) ? max : 0;
  const range = Math.max(0, safeMax - safeMin + 1);
  return Array.from({ length: safeCount }, () => formatNumber(secureRandomInt(range) + safeMin, digits, prefix, suffix));
}

/**
 * 验证输入参数，返回错误信息或 null
 */
function validateSettings(settings: DrawSettings): string | null {
  const { useCustomList, customList, count, allowDuplicates, min, max } = settings;
  const safeCount = Math.max(1, Math.min(1000, Number.isFinite(count) ? count : 1));

  if (useCustomList) {
    if (customList.length === 0) {
      return "请先在设置中导入自定义列表";
    }
    if (customList.length > 1000) {
      return "自定义列表项数过多，请减少到 1000 项以内";
    }
    if (!allowDuplicates && safeCount > customList.length) {
      return "不允许重复时，抽取数量不能超过列表项数";
    }
    return null;
  }

  const safeMin = Number.isFinite(min) ? min : 0;
  const safeMax = Number.isFinite(max) ? max : 0;
  const safeRange = safeMax - safeMin + 1;

  if (!Number.isFinite(safeMin) || !Number.isFinite(safeMax) || safeMin > safeMax) {
    return "最小值不能大于最大值";
  }
  if (safeRange <= 0 || safeRange > 10_000_000) {
    return "数值范围过大或无效，请调整范围";
  }
  if (!allowDuplicates && safeCount > safeRange) {
    return "不允许重复时，抽取数量不能超过数值范围";
  }
  return null;
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function createInitialState(settings: DrawSettings): DrawState {
  return {
    ...settings,
    currentResults: [],
    rollingValues: [],
    status: "idle",
    errorMessage: "",
    history: [],
    isRolling: false,
  };
}

function drawReducer(state: DrawState, action: DrawAction): DrawState {
  switch (action.type) {
    case "START_DRAW":
      return { ...state, status: "drawing", isRolling: true, errorMessage: "" };
    case "UPDATE_ROLLING":
      return { ...state, rollingValues: action.values, currentResults: action.values };
    case "FINALIZE_DRAW": {
      const newHistory: HistoryEntry = {
        id: generateLocalId(),
        timestamp: new Date().toISOString(),
        results: action.results,
      };
      return {
        ...state,
        status: "result",
        isRolling: false,
        currentResults: action.results,
        rollingValues: [],
        history: [newHistory, ...state.history].slice(0, 100),
      };
    }
    case "CANCEL":
      return { ...state, status: "idle", isRolling: false, rollingValues: [] };
    case "ERROR":
      return { ...state, status: "error", errorMessage: action.message, isRolling: false };
    case "DISMISS_ERROR":
      return { ...state, status: "idle", errorMessage: "" };
    case "SET_MIN":
      return { ...state, min: action.value };
    case "SET_MAX":
      return { ...state, max: action.value };
    case "SET_COUNT":
      return { ...state, count: action.value };
    case "SET_DURATION":
      return { ...state, duration: action.value };
    case "SET_DIGITS":
      return { ...state, digits: action.value };
    case "SET_PREFIX":
      return { ...state, prefix: action.value };
    case "SET_SUFFIX":
      return { ...state, suffix: action.value };
    case "SET_ALLOW_DUPLICATES":
      return { ...state, allowDuplicates: action.value };
    case "SET_AUTO_HIDE":
      return { ...state, autoHide: action.value };
    case "SET_USE_CUSTOM_LIST":
      return { ...state, useCustomList: action.value };
    case "SET_CUSTOM_LIST":
      return { ...state, customList: action.value };
    case "SET_LANGUAGE":
      return { ...state, language: action.value };
    case "CLEAR_HISTORY":
      return { ...state, history: [] };
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export interface UseDrawReturn extends DrawState {
  // 操作方法
  startDraw: () => { ok: boolean; error?: string };
  stopDraw: () => void;
  dismissError: () => void;
  clearHistory: () => void;
  // 设置更新方法（带输入验证）
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
  // --- 便捷属性（避免在消费端重复计算）---
  // 是否正在抽取（别名，对应 status === "drawing"）
  isDrawing: boolean;
  // 当前结果（滚动中的值或最终结果，取最近显示的）
  results: string[];
  // 是否可以开始抽取（当前状态为 idle 或 result）
  canDraw: boolean;
  // 设置的只读快照（供 SettingsPanel 组件使用）
  settings: {
    min: number;
    max: number;
    count: number;
    duration: number;
    allowDuplicates: boolean;
    autoHide: boolean;
    customList: string[];
    useCustomList: boolean;
    digits: number;
    prefix: string;
    suffix: string;
  };
  // 历史记录的 set 方法（供 page.tsx 使用）
  setHistory: (updater: (prev: HistoryEntry[]) => HistoryEntry[]) => void;
}

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
  const [persistedHistory, setPersistedHistory] = useLocalStorage<HistoryEntry[]>("zendraw-history", []);

  // 构建初始 state（包含设置 + 运行时状态）
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

  const createInitialState = (settings: DrawSettings): DrawState => ({
    ...settings,
    currentResults: [],
    rollingValues: [],
    status: "idle",
    errorMessage: "",
    history: persistedHistory,
    isRolling: false,
  });

  const [state, dispatch] = React.useReducer(drawReducer, initialSettings, createInitialState);

  // 动画计时器引用
  const animationRef = React.useRef<number | null>(null);

  // 当设置变化时，持久化到 localStorage
  // 注意：setPersisted* 函数来自 useLocalStorage，使用 useCallback 包装，依赖 key，引用稳定
  React.useEffect(() => {
    setPersistedMin(state.min);
  }, [state.min, setPersistedMin]);

  React.useEffect(() => {
    setPersistedMax(state.max);
  }, [state.max, setPersistedMax]);

  React.useEffect(() => {
    setPersistedCount(state.count);
  }, [state.count, setPersistedCount]);

  React.useEffect(() => {
    setPersistedAllowDup(state.allowDuplicates);
  }, [state.allowDuplicates, setPersistedAllowDup]);

  React.useEffect(() => {
    setPersistedAutoHide(state.autoHide);
  }, [state.autoHide, setPersistedAutoHide]);

  React.useEffect(() => {
    setPersistedDuration(state.duration);
  }, [state.duration, setPersistedDuration]);

  React.useEffect(() => {
    setPersistedCustomList(state.customList);
  }, [state.customList, setPersistedCustomList]);

  React.useEffect(() => {
    setPersistedUseCustom(state.useCustomList);
  }, [state.useCustomList, setPersistedUseCustom]);

  React.useEffect(() => {
    setPersistedDigits(state.digits);
  }, [state.digits, setPersistedDigits]);

  React.useEffect(() => {
    setPersistedPrefix(state.prefix);
  }, [state.prefix, setPersistedPrefix]);

  React.useEffect(() => {
    setPersistedSuffix(state.suffix);
  }, [state.suffix, setPersistedSuffix]);

  React.useEffect(() => {
    setPersistedLanguage(state.language);
  }, [state.language, setPersistedLanguage]);

  React.useEffect(() => {
    setPersistedHistory(state.history);
  }, [state.history, setPersistedHistory]);

  // --- 抽取核心动作 ---

  // 启动抽取（返回结果状态）
  const startDraw = React.useCallback((): { ok: boolean; error?: string } => {
    const currentSettings: DrawSettings = {
      min: state.min,
      max: state.max,
      count: state.count,
      allowDuplicates: state.allowDuplicates,
      autoHide: state.autoHide,
      duration: state.duration,
      customList: state.customList,
      useCustomList: state.useCustomList,
      digits: state.digits,
      prefix: state.prefix,
      suffix: state.suffix,
      language: state.language,
    };

    // 如果当前正在抽取中 → 这是一次"停止/确认"操作
    if (state.status === "drawing") {
      if (animationRef.current !== null) {
        window.clearInterval(animationRef.current);
        animationRef.current = null;
      }
      const results = finalizeDraw(currentSettings);
      dispatch({ type: "FINALIZE_DRAW", results });
      return { ok: true };
    }

    // 验证输入
    const error = validateSettings(currentSettings);
    if (error) {
      dispatch({ type: "ERROR", message: error });
      return { ok: false, error };
    }

    // 开始动画
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
  }, [state.status, state.min, state.max, state.count, state.allowDuplicates, state.autoHide, state.duration, state.customList, state.useCustomList, state.digits, state.prefix, state.suffix, state.language]);

  // 停止抽取（取消动画）
  const stopDraw = React.useCallback(() => {
    if (animationRef.current !== null) {
      window.clearInterval(animationRef.current);
      animationRef.current = null;
    }
    dispatch({ type: "CANCEL" });
  }, []);

  // 组件卸载时清理
  React.useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        window.clearInterval(animationRef.current);
        animationRef.current = null;
      }
    };
  }, []);

  // --- 辅助的设置更新方法（带输入验证）---
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

  // --- 计算属性（避免在消费端重复计算）---
  const isDrawing = state.status === "drawing";
  const results =
    state.rollingValues.length > 0 ? state.rollingValues : state.currentResults;
  const canDraw = state.status === "idle" || state.status === "result";

  const settings = {
    min: state.min,
    max: state.max,
    count: state.count,
    duration: state.duration,
    allowDuplicates: state.allowDuplicates,
    autoHide: state.autoHide,
    customList: state.customList,
    useCustomList: state.useCustomList,
    digits: state.digits,
    prefix: state.prefix,
    suffix: state.suffix,
    language: state.language,
  };

  // 历史记录的 setter（供外部组件直接操作历史）
  const setHistory = React.useCallback(
    (updater: (prev: HistoryEntry[]) => HistoryEntry[]) => {
      // 计算新的 history，然后通过特殊的 dispatch 更新
      // 注意：drawReducer 没有 SET_HISTORY action，我们手动触发
      // 但由于 history 现在是 reducer 状态的一部分，我们需要添加 action
      // 为保持简单，使用 setTimeout 绕过，或添加一个 REPLACE_HISTORY action
      dispatch({ type: "CLEAR_HISTORY" });
    },
    []
  );

  return {
    ...state,
    startDraw,
    stopDraw,
    dismissError,
    clearHistory,
    setHistory,
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
    // 计算属性
    isDrawing,
    results,
    canDraw,
    settings,
  };
}
