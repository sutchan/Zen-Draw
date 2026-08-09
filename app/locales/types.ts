// locales/types.ts v5.6.0 — 国际化类型定义（TranslationKey 联合类型，单一事实来源）
export type Language = "en" | "zh";

export type TranslationKey =
  | "title" | "settings" | "close" | "history"
  | "minVal" | "maxVal" | "drawCount"
  | "allowDup" | "allowDupDesc" | "autoHide" | "autoHideDesc"
  | "custom" | "drawSettings" | "appearance"
  | "drawDuration" | "drawDurationDesc"
  | "theme" | "themeMode" | "themeLight" | "themeDark" | "themeSystem"
  | "themePreset" | "themeDefault" | "themeOcean" | "themeForest"
  | "themeSunset" | "themePurple" | "themeNeon"
  | "themeSakura" | "themeMidnight" | "themeRetro" | "themePixel" | "themeRose"
  | "fontFamily" | "fontSans" | "fontMono" | "fontSerif"
  | "useCustomList" | "export" | "import_"
  | "minDigits" | "minDigitsDesc" | "prefix" | "suffix"
  | "historyDesc" | "noHistory"
  | "ready" | "drawing" | "startDraw"
  | "minMaxError" | "rangeError" | "clearHistory"
  | "switchLang" | "cancel" | "save"
  | "itemsLoaded" | "noItems"
  // 主界面
  | "appTitle" | "appSubtitle" | "drawMainArea" | "drawDisplayArea"
  // 按钮
  | "stopDraw" | "startHint" | "stopHint"
  // 欢迎/错误
  | "welcomeHint" | "errorTitle" | "errorMessage"
  // 结果
  | "resultLabel" | "resultRegion"
  // 惊艳体验升级包
  | "revealTitle" | "milestoneDraws" | "emptyStateHint"
  // 主题
  | "switchLight" | "switchDark"
  // 页脚
  | "footerInfo"
  // 导入
  | "importDesc" | "confirmImport" | "customList" | "customListHint"
  // 错误
  | "errCustomListEmpty" | "errCustomListTooMany" | "errCustomListRange"
  | "errRangeInvalid"
  // 历史记录
  | "clickToCopy" | "autoSaveDesc"
  // 通用
  | "copied" | "copiedToClipboard" | "copyResult" | "listPlaceholder"
  // 设置增强
  | "formatPreview" | "languageLabel" | "langZh" | "langEn"
  | "clearList" | "removeItem" | "editList" | "listHintEmpty" | "colorPreview"
  | "duplicateItemsWarning"
  // 体验设置
  | "experience" | "sound" | "soundDesc" | "density" | "densityDesc"
  | "densityComfortable" | "densityCompact" | "resetSettings" | "resetSettingsDesc"
  // 抽取模式
  | "drawMode" | "modeNumber" | "modeList"
  // 列表模式与格式预览
  | "listModeFormatNote" | "notApplicable" | "listNotEnabledHint";

export type TranslationDict = Record<TranslationKey, string>;
