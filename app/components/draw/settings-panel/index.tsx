// components/draw/settings-panel/index.tsx v5.3.3 —— 设置面板内容（重构：仅渲染内容，面板外壳由 AppHeader 的 Sheet 提供）
"use client";

import * as React from "react";
import { Settings2, History } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HistoryList, type HistoryEntry } from "@/components/draw/history-list";
import { DrawSettings } from "../draw-settings";
import { AppearanceSettings } from "../appearance-settings";
import { CustomListSettings } from "../custom-list-settings";
import { HeaderBar } from "./header-bar";
import { createTranslator } from "@/lib/i18n";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SettingsPanelProps {
  // 抽取设置
  min: number;
  max: number;
  count: number;
  duration: number;
  allowDuplicates: boolean;
  autoHide: boolean;
  // 自定义列表
  customList: string[];
  useCustomList: boolean;
  // 显示设置
  digits: number;
  prefix: string;
  suffix: string;
  // 设置更新
  onMinChange: (value: number | string) => void;
  onMaxChange: (value: number | string) => void;
  onCountChange: (value: number | string) => void;
  onDurationChange: (value: number | string) => void;
  onAllowDuplicatesChange: (value: boolean) => void;
  onAutoHideChange: (value: boolean) => void;
  onCustomListChange: (items: string[]) => void;
  onUseCustomListChange: (value: boolean) => void;
  onDigitsChange: (value: number | string) => void;
  onPrefixChange: (value: string) => void;
  onSuffixChange: (value: string) => void;
  // 语言切换
  language: "zh" | "en";
  onLanguageToggle: () => void;
  // 历史记录
  history: HistoryEntry[];
  onClearHistory: () => void;
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function SettingsPanel(props: SettingsPanelProps) {
  const {
    min, max, count, duration,
    allowDuplicates, autoHide,
    customList, useCustomList,
    digits, prefix, suffix,
    onMinChange, onMaxChange, onCountChange, onDurationChange,
    onAllowDuplicatesChange, onAutoHideChange,
    onCustomListChange, onUseCustomListChange,
    onDigitsChange, onPrefixChange, onSuffixChange,
    language, onLanguageToggle,
    history, onClearHistory,
  } = props;

  const t = React.useMemo(() => createTranslator(language), [language]);

  return (
    <div className="flex h-full flex-col">
      {/* 顶部品牌栏（静态，含语言切换） */}
      <HeaderBar language={language} onLanguageToggle={onLanguageToggle} />

      {/* 选项卡内容 */}
      <Tabs defaultValue="settings" className="flex h-full flex-col">
        <TabsList className="w-full flex gap-1 p-2 bg-muted/30 rounded-none border-b border-border/20 m-0">
          <TabsTrigger
            value="settings"
            className="flex-1 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium h-10"
          >
            <Settings2 className="w-4 h-4 mr-1.5" aria-hidden="true" />
            {t("drawSettings")}
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="flex-1 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium h-10"
          >
            <History className="w-4 h-4 mr-1.5" aria-hidden="true" />
            {t("history")}
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="settings" className="px-6 py-6 pb-12 focus-visible:outline-none">
            <DrawSettings
              language={language}
              useCustomList={useCustomList}
              min={min} max={max} count={count} duration={duration}
              allowDuplicates={allowDuplicates} autoHide={autoHide}
              onMin={onMinChange} onMax={onMaxChange}
              onCount={onCountChange} onDuration={onDurationChange}
              onAllowDuplicates={onAllowDuplicatesChange}
              onAutoHide={onAutoHideChange}
            />

            <AppearanceSettings
              language={language}
              useCustomList={useCustomList}
              digits={digits} prefix={prefix} suffix={suffix}
              onDigits={onDigitsChange} onPrefix={onPrefixChange} onSuffix={onSuffixChange}
            />

            <CustomListSettings
              language={language}
              useCustomList={useCustomList} customList={customList}
              onUseCustomListChange={onUseCustomListChange}
              onImport={onCustomListChange}
            />
          </TabsContent>

          <TabsContent value="history" className="px-6 py-6 pb-12 focus-visible:outline-none">
            <HistoryList
              history={history}
              onClear={onClearHistory}
              language={language}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

