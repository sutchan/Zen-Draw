// locales/types.ts v5.7.9 — 国际化类型定义（TranslationKey 联合类型，单一事实来源）
export type Language = "en" | "zh";

export type TranslationKey =
  | "settings" | "close" | "history"
  | "minVal" | "maxVal" | "drawCount"
  | "allowDup" | "allowDupDesc" | "autoHide" | "autoHideDesc"
  | "drawSettings" | "appearance"
  | "drawDuration" | "drawDurationDesc"
  | "themeMode" | "themeLight" | "themeDark" | "themeSystem"
  | "themePreset" | "themeDefault" | "themeOcean" | "themeForest"
  | "themeSunset" | "themePurple" | "themeNeon"
  | "themeSakura" | "themeMidnight" | "themeRetro" | "themePixel" | "themeRose"
  | "fontFamily" | "fontSans" | "fontMono" | "fontSerif"
  | "useCustomList"
  | "minDigits" | "minDigitsDesc" | "prefix" | "suffix"
  | "historyDesc" | "noHistory"
  | "ready" | "startDraw"
  | "minMaxError" | "rangeError" | "clearHistory"
  | "switchLang" | "cancel" | "save"
  | "itemsLoaded"
  // 主界面
  | "appTitle" | "appSubtitle" | "drawMainArea" | "drawDisplayArea"
  // 按钮
  | "stopDraw" | "startHint" | "stopHint" | "continueDraw" | "continueHint"
  // 欢迎/错误
  | "welcomeHint" | "errorTitle" | "errorMessage"
  | "pageErrorTitle" | "pageErrorDesc" | "retry" | "backHome"
  | "notFoundTitle" | "notFoundDesc"
  // 结果
  | "resultLabel" | "resultRegion"
  // 惊艳体验升级包
  | "revealTitle" | "milestoneDraws" | "emptyStateHint"
  // 页脚
  | "footerInfo"
  // 列表导入
  | "customList" | "customListHint"
  // 错误
  | "errCustomListEmpty" | "errCustomListTooMany" | "errCustomListRange"
  | "errRangeInvalid"
  // 历史记录
  | "clickToCopy" | "autoSaveDesc"
  // 通用
  | "copied" | "copiedToClipboard" | "copyResult" | "listPlaceholder"
  // 设置增强
  | "formatPreview" | "languageLabel" | "langZh" | "langEn"
  | "clearList" | "editList" | "listHintEmpty"
  | "duplicateItemsWarning"
  // 体验设置
  | "experience" | "sound" | "soundDesc" | "density" | "densityDesc"
  | "densityComfortable" | "densityCompact"
  | "confetti" | "confettiDesc" | "reduceMotion" | "reduceMotionDesc"
  | "resetSettings" | "resetSettingsDesc"
  // 列表模式与格式预览
  | "listModeFormatNote" | "notApplicable" | "listNotEnabledHint";

export type TranslationDict = Record<TranslationKey, string>;
