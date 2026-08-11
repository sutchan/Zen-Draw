// components/draw/settings-panel/index.tsx v5.7.6 —— 设置面板（Tabs + 子设置区，无嵌套 Sheet）
"use client";

import * as React from "react";
import { Settings, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { createTranslator } from "@/lib/i18n";
import type { UseDrawReturn } from "@/hooks/draw-types";
import { DrawSettings } from "@/components/draw/draw-settings";
import { AppearanceSettings } from "@/components/draw/appearance-settings";
import { CustomListSettings } from "@/components/draw/custom-list-settings";
import { HistoryList } from "@/components/draw/history-list";
import { HeaderBar } from "@/components/draw/settings-panel/header-bar";
import { CustomListInline } from "@/components/draw/settings-panel/custom-list-inline";
import { ExperienceSettings } from "@/components/draw/settings-panel/experience-settings";

export function SettingsPanel({ ...settings }: UseDrawReturn & { language: "zh" | "en"; onLanguageToggle: () => void }) {
  const {
    min, max, count,
    duration,
    allowDuplicates, autoHide, useCustomList,
    customList,
    digits, prefix, suffix,
    soundEnabled, setSoundEnabled,
    density, setDensity,
    confettiEnabled, setConfettiEnabled,
    reduceMotion, setReduceMotion,
    resetSettings,
    setMin, setMax, setCount,
    setDuration,
    setAllowDuplicates, setAutoHide, setUseCustomList,
    setDigits, setPrefix, setSuffix,
    setCustomList,
    language, onLanguageToggle,
    history, clearHistory,
  } = settings;

  const t = React.useMemo(() => createTranslator(language), [language]);
  const [customListDialogOpen, setCustomListDialogOpen] = React.useState(false);

  return (
    <>
      <Sheet>
        <Tooltip>
          <TooltipTrigger
            render={
              <SheetTrigger
                className="size-10 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all flex items-center justify-center"
                aria-label={t("settings")}
              >
                <Settings className="size-5" aria-hidden="true" />
              </SheetTrigger>
            }
          />
          <TooltipContent>{t("settings")}</TooltipContent>
        </Tooltip>

        <SheetContent id="settings-panel" side="right" className="w-full sm:w-[380px] p-0 bg-background/95 backdrop-blur-xl border-border/20 flex flex-col">
          <HeaderBar language={language} onLanguageToggle={onLanguageToggle} />

          <Tabs defaultValue="draw" className="flex flex-1 min-h-0 flex-col">
            <TabsList className="w-full flex gap-1 p-2 bg-muted/30 rounded-none border-b border-border/20 m-0">
              <TabsTrigger
                value="draw"
                className="flex-1 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium h-10"
              >
                {t("drawSettings")}
              </TabsTrigger>
              <TabsTrigger
                value="appearance"
                className="flex-1 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium h-10"
              >
                {t("appearance")}
              </TabsTrigger>
              <TabsTrigger
                value="experience"
                className="flex-1 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium h-10"
              >
                {t("experience")}
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="flex-1 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium h-10"
              >
                {t("history")}
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto">
              <TabsContent id="tab-panel-draw" value="draw" className="px-6 py-6 pb-12 focus-visible:outline-none">
                <DrawSettings
                  language={language}
                  min={min}
                  max={max}
                  count={count}
                  duration={duration}
                  allowDuplicates={allowDuplicates}
                  useCustomList={useCustomList}
                  onMin={setMin}
                  onMax={setMax}
                  onCount={setCount}
                  onDuration={setDuration}
                  onAllowDuplicates={setAllowDuplicates}
                  onUseCustomList={setUseCustomList}
                />
                <div className="mt-5">
                  <CustomListInline
                    t={t}
                    customList={customList}
                    useCustomList={useCustomList}
                    onOpenDialog={() => setCustomListDialogOpen(true)}
                    onClearList={() => setCustomList([])}
                  />
                </div>
              </TabsContent>

              <TabsContent id="tab-panel-appearance" value="appearance" className="px-6 py-6 pb-12 focus-visible:outline-none">
                <AppearanceSettings
                  language={language}
                  digits={digits}
                  prefix={prefix}
                  suffix={suffix}
                  useCustomList={useCustomList}
                  onDigits={setDigits}
                  onPrefix={setPrefix}
                  onSuffix={setSuffix}
                  onLanguageChange={onLanguageToggle}
                />
              </TabsContent>

              <TabsContent id="tab-panel-experience" value="experience" className="px-6 py-6 pb-12 focus-visible:outline-none">
                <ExperienceSettings
                  language={language}
                  soundEnabled={soundEnabled}
                  onSoundEnabled={setSoundEnabled}
                  confettiEnabled={confettiEnabled}
                  onConfettiEnabled={setConfettiEnabled}
                  reduceMotion={reduceMotion}
                  onReduceMotion={setReduceMotion}
                  autoHide={autoHide}
                  onAutoHide={setAutoHide}
                  density={density}
                  onDensity={setDensity}
                  onReset={resetSettings}
                />
              </TabsContent>

              <TabsContent id="tab-panel-history" value="history" className="px-6 py-6 pb-12 focus-visible:outline-none">
                <div id="history-tab-header" className="flex items-center justify-between mb-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                    {t("history")}
                  </p>
                  {history.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="size-3.5" aria-hidden="true" />
                      {t("clearHistory")}
                    </button>
                  )}
                </div>
                <HistoryList history={history} onClear={clearHistory} language={language} />
              </TabsContent>
            </div>
          </Tabs>
        </SheetContent>
      </Sheet>

      <CustomListSettings
        language={language}
        open={customListDialogOpen}
        onOpenChange={setCustomListDialogOpen}
        customList={customList}
        onCustomListChange={setCustomList}
      />
    </>
  );
}
