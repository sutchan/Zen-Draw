// components/draw/settings-panel/index.tsx v5.4.1 —— 设置面板（包装 Sheet + Tabs + 子设置区）
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

export function SettingsPanel({ ...settings }: UseDrawReturn & { language: "zh" | "en"; onLanguageToggle: () => void }) {
  const {
    min, max, count,
    duration,
    allowDuplicates, autoHide,
    customList,
    digits, prefix, suffix,
    setMin, setMax, setCount,
    setDuration,
    setAllowDuplicates, setAutoHide,
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

        <SheetContent side="right" className="w-full sm:w-[26rem] p-0 bg-background/95 backdrop-blur-xl border-border/20 flex flex-col">
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
                value="history"
                className="flex-1 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium h-10"
              >
                {t("history")}
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto">
              <TabsContent value="draw" className="px-6 py-6 pb-12 focus-visible:outline-none">
                <DrawSettings
                  language={language}
                  min={min}
                  max={max}
                  count={count}
                  duration={duration}
                  allowDuplicates={allowDuplicates}
                  autoHide={autoHide}
                  onMin={setMin}
                  onMax={setMax}
                  onCount={setCount}
                  onDuration={setDuration}
                  onAllowDuplicates={setAllowDuplicates}
                  onAutoHide={setAutoHide}
                />
                <div className="mt-5">
                  <CustomListInline
                    t={t}
                    customList={customList}
                    onOpenDialog={() => setCustomListDialogOpen(true)}
                    onClearList={() => setCustomList([])}
                  />
                </div>
              </TabsContent>

              <TabsContent value="appearance" className="px-6 py-6 pb-12 focus-visible:outline-none">
                <AppearanceSettings
                  language={language}
                  digits={digits}
                  prefix={prefix}
                  suffix={suffix}
                  onDigits={setDigits}
                  onPrefix={setPrefix}
                  onSuffix={setSuffix}
                  onLanguageChange={onLanguageToggle}
                />
              </TabsContent>

              <TabsContent value="history" className="px-6 py-6 pb-12 focus-visible:outline-none">
                <div className="flex items-center justify-between mb-4">
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

function CustomListInline({
  t, customList, onOpenDialog, onClearList,
}: {
  t: ReturnType<typeof createTranslator>;
  customList: string[];
  onOpenDialog: () => void;
  onClearList: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border/30 bg-muted/20 p-4 space-y-3">
      <p className="text-sm font-medium">{t("customList")}</p>
      <p className="text-xs text-muted-foreground">
        {customList.length > 0 ? `${customList.length} ${t("itemsLoaded")}` : t("listHintEmpty")}
      </p>
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={onOpenDialog}
          className="h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium transition-opacity hover:opacity-90"
        >
          {t("editList")}
        </button>
        <button
          type="button"
          onClick={onClearList}
          disabled={customList.length === 0}
          className="h-10 rounded-xl border border-border/30 text-sm font-medium text-muted-foreground transition-colors hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t("clearList")}
        </button>
      </div>
    </div>
  );
}
