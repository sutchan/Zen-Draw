// hooks/draw-types.ts v3.3.0 — 抽签模块类型定义

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

export type DrawAction =
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
  | { type: "SET_HISTORY"; value: HistoryEntry[] }
  | { type: "DISMISS_ERROR" };

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
    language: "zh" | "en";
  };
  // 历史记录的 set 方法（供 page.tsx 使用）
  setHistory: (updater: (prev: HistoryEntry[]) => HistoryEntry[]) => void;
}
