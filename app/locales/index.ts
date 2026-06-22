// locales/index.ts v1.0 — 国际化翻译模块
// 类型定义：支持扩展语言键
export type Language = "en" | "zh";

export type TranslationKey =
  | "title"
  | "settings"
  | "history"
  | "rangeCount"
  | "rangeDesc"
  | "minVal"
  | "maxVal"
  | "drawCount"
  | "allowDup"
  | "autoHide"
  | "autoHideDesc"
  | "clickToExpand"
  | "configureHint"
  | "custom"
  | "display"
  | "drawAgain"
  | "drawSettings"
  | "appearance"
  | "drawDuration"
  | "drawDurationDesc"
  | "theme"
  | "themeMode"
  | "themeLight"
  | "themeDark"
  | "themeSystem"
  | "themePreset"
  | "themeDefault"
  | "themeOcean"
  | "themeForest"
  | "themeSunset"
  | "themePurple"
  | "themeNeon"
  | "fontFamily"
  | "fontSans"
  | "fontMono"
  | "fontSerif"
  | "listImport"
  | "listImportDesc"
  | "useCustomList"
  | "export"
  | "displayRules"
  | "displayDesc"
  | "minDigits"
  | "minDigitsDesc"
  | "prefix"
  | "suffix"
  | "drawHistory"
  | "historyDesc"
  | "noHistory"
  | "ready"
  | "drawing"
  | "startDraw"
  | "minMaxError"
  | "rangeError"
  | "clearHistory"
  | "toggleUI"
  | "switchLang"
  | "notice"
  | "ok"
  | "cancel"
  | "import_"
  | "itemsLoaded"
  | "noItems";

type TranslationDict = Record<TranslationKey, string>;

const enTranslations: TranslationDict = {
  title: "ZenDraw",
  settings: "Settings",
  history: "History",
  rangeCount: "Range & Count",
  rangeDesc: "Define the pool of numbers.",
  minVal: "Min Value",
  maxVal: "Max Value",
  drawCount: "Draw Count",
  allowDup: "Allow Duplicates",
  autoHide: "Auto-hide UI",
  autoHideDesc: "Hide control panel automatically when idle or drawing.",
  clickToExpand: "Click to expand options",
  configureHint: "Configure range and options to start drawing",
  custom: "Custom List",
  display: "Display Options",
  drawAgain: "Draw Again",
  drawSettings: "Draw Settings",
  appearance: "Appearance",
  drawDuration: "Draw Duration (s)",
  drawDurationDesc: "Set the duration of the rolling animation.",
  theme: "Theme",
  themeMode: "Appearance",
  themeLight: "Light",
  themeDark: "Dark",
  themeSystem: "System",
  themePreset: "Theme Preset",
  themeDefault: "Default",
  themeOcean: "Ocean",
  themeForest: "Forest",
  themeSunset: "Sunset",
  themePurple: "Purple",
  themeNeon: "Neon",
  fontFamily: "Font Family",
  fontSans: "Sans Serif",
  fontMono: "Monospace",
  fontSerif: "Serif",
  listImport: "List Import",
  listImportDesc: "Paste items, one per line.",
  useCustomList: "Use Custom List",
  export: "Export Results",
  displayRules: "Display Rules",
  displayDesc: "Customize how numbers appear.",
  minDigits: "Min Digits (Padding)",
  minDigitsDesc: "Set to 0 for no padding.",
  prefix: "Prefix",
  suffix: "Suffix",
  drawHistory: "Draw History",
  historyDesc: "Recent results.",
  noHistory: "No history yet.",
  ready: "Ready to Draw",
  drawing: "Drawing...",
  startDraw: "START DRAW",
  minMaxError: "Minimum value cannot be greater than maximum value.",
  rangeError: "Cannot draw more unique numbers than the available range.",
  clearHistory: "Clear History",
  toggleUI: "Toggle Control Panel",
  switchLang: "Switch Language",
  notice: "Notice",
  ok: "OK",
  cancel: "Cancel",
  import_: "Import",
  itemsLoaded: "items loaded",
  noItems: "No items",
};

const zhTranslations: TranslationDict = {
  title: "禅抽",
  settings: "设置",
  history: "历史记录",
  rangeCount: "范围与数量",
  rangeDesc: "定义抽取数字的范围。",
  minVal: "最小值",
  maxVal: "最大值",
  drawCount: "抽取数量",
  allowDup: "允许重复",
  autoHide: "自动隐藏侧边栏",
  autoHideDesc: "空闲或抽取时自动隐藏控制面板。",
  clickToExpand: "点击展开选项",
  configureHint: "设置范围和选项后开始抽取",
  custom: "自定义名单",
  display: "显示选项",
  drawAgain: "再抽一次",
  drawSettings: "抽取设置",
  appearance: "外观",
  drawDuration: "抽取时长（秒）",
  drawDurationDesc: "设置数字滚动动画的持续时间。",
  theme: "主题",
  themeMode: "外观",
  themeLight: "浅色",
  themeDark: "深色",
  themeSystem: "跟随系统",
  themePreset: "配色方案",
  themeDefault: "默认",
  themeOcean: "海洋蓝",
  themeForest: "森林绿",
  themeSunset: "落日橙",
  themePurple: "紫罗兰",
  themeNeon: "霓虹",
  fontFamily: "字体样式",
  fontSans: "无衬线",
  fontMono: "等宽",
  fontSerif: "衬线",
  listImport: "名单导入",
  listImportDesc: "粘贴名单内容，每行一项。",
  useCustomList: "使用自定义名单",
  export: "导出结果",
  displayRules: "显示规则",
  displayDesc: "自定义数字显示格式。",
  minDigits: "最小位数（补零）",
  minDigitsDesc: "设为 0 则不补零。",
  prefix: "前缀",
  suffix: "后缀",
  drawHistory: "抽签历史",
  historyDesc: "最近的抽签结果。",
  noHistory: "暂无历史记录。",
  ready: "准备就绪",
  drawing: "抽取中…",
  startDraw: "开始抽取",
  minMaxError: "最小值不能大于最大值。",
  rangeError: "抽取的不重复数量不能超过可用范围。",
  clearHistory: "清空历史",
  toggleUI: "切换控制面板",
  switchLang: "切换语言",
  notice: "提示",
  ok: "确定",
  cancel: "取消",
  import_: "导入",
  itemsLoaded: "项已加载",
  noItems: "暂无项目",
};

export const translations: Record<Language, TranslationDict> = {
  en: enTranslations,
  zh: zhTranslations,
};
