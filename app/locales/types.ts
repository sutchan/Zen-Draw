// locales/types.ts v3.3.0 — 国际化类型定义
export type Language = "en" | "zh";

export type TranslationKey =
  | "title" | "settings" | "history"
  | "rangeCount" | "rangeDesc" | "minVal" | "maxVal" | "drawCount"
  | "allowDup" | "autoHide" | "autoHideDesc"
  | "clickToExpand" | "configureHint"
  | "custom" | "display" | "drawAgain" | "drawSettings" | "appearance"
  | "drawDuration" | "drawDurationDesc"
  | "theme" | "themeMode" | "themeLight" | "themeDark" | "themeSystem"
  | "themePreset" | "themeDefault" | "themeOcean" | "themeForest"
  | "themeSunset" | "themePurple" | "themeNeon"
  | "themeSakura" | "themeMidnight" | "themeRetro" | "themePixel"
  | "fontFamily" | "fontSans" | "fontMono" | "fontSerif"
  | "listImport" | "listImportDesc" | "useCustomList"
  | "export" | "displayRules" | "displayDesc"
  | "minDigits" | "minDigitsDesc" | "prefix" | "suffix"
  | "drawHistory" | "historyDesc" | "noHistory"
  | "ready" | "drawing" | "startDraw"
  | "minMaxError" | "rangeError" | "clearHistory"
  | "toggleUI" | "switchLang" | "notice" | "ok" | "cancel"
  | "import_" | "itemsLoaded" | "noItems"
  // 主界面
  | "appTitle" | "appSubtitle" | "drawMainArea" | "drawDisplayArea"
  // 按钮
  | "stopDraw" | "startHint" | "stopHint"
  // 欢迎/错误
  | "welcomeHint" | "errorTitle" | "errorMessage"
  // 结果
  | "resultLabel" | "resultRegion" | "drawResults"
  // 主题
  | "switchLight" | "switchDark"
  // 页脚
  | "footerInfo"
  // 导入
  | "importDesc" | "confirmImport" | "exportList"
  // 错误
  | "errCustomListEmpty" | "errCustomListTooMany" | "errCustomListRange"
  | "errRangeInvalid"
  // 通用
  | "autoSaveDesc" | "clickToCopy" | "copied" | "copiedToClipboard" | "copyResult"
  | "listPlaceholder" | "recordLabel" | "resultsCount" | "settingsPanel";

export type TranslationDict = Record<TranslationKey, string>;
