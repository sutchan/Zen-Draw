// components/draw/settings-panel/index.tsx v5.6.0 —— 设置面板（Tabs + 子设置区，无嵌套 Sheet）
"use client";

import * as React from "react";
import { Settings, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
    allowDuplicates, autoHide, useCustomList,
    customList,
    digits, prefix, suffix,
    soundEnabled, setSoundEnabled,
    density, setDensity,
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
              <TabsContent value="draw" className="px-6 py-6 pb-12 focus-visible:outline-none">
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

              <TabsContent value="appearance" className="px-6 py-6 pb-12 focus-visible:outline-none">
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

              <TabsContent value="experience" className="px-6 py-6 pb-12 focus-visible:outline-none">
                <ExperienceSettings
                  language={language}
                  soundEnabled={soundEnabled}
                  onSoundEnabled={setSoundEnabled}
                  autoHide={autoHide}
                  onAutoHide={setAutoHide}
                  density={density}
                  onDensity={setDensity}
                  onReset={resetSettings}
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
  t, customList, useCustomList, onOpenDialog, onClearList,
}: {
  t: ReturnType<typeof createTranslator>;
  customList: string[];
  useCustomList: boolean;
  onOpenDialog: () => void;
  onClearList: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border/30 bg-muted/20 p-4 space-y-3">
      <p className="text-sm font-medium">{t("customList")}</p>
      <p className="text-xs text-muted-foreground">
        {customList.length > 0 ? `${customList.length} ${t("itemsLoaded")}` : t("listHintEmpty")}
      </p>
      {customList.length > 0 && !useCustomList && (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          {t("listNotEnabledHint")}
        </p>
      )}
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

function ExperienceSettings({
  language,
  soundEnabled,
  onSoundEnabled,
  autoHide,
  onAutoHide,
  density,
  onDensity,
  onReset,
}: {
  language: "zh" | "en";
  soundEnabled: boolean;
  onSoundEnabled: (value: boolean) => void;
  autoHide: boolean;
  onAutoHide: (value: boolean) => void;
  density: "comfortable" | "compact";
  onDensity: (value: "comfortable" | "compact") => void;
  onReset: () => void;
}) {
  const t = React.useMemo(() => createTranslator(language), [language]);

  return (
    <div className="space-y-5 pt-2">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
        {t("experience")}
      </p>

      {/* 音效 */}
      <Card className="p-4 rounded-2xl border-border/30 bg-muted/20">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Label>{t("sound")}</Label>
            <p className="text-xs text-muted-foreground mt-0.5">{t("soundDesc")}</p>
          </div>
          <Switch
            checked={soundEnabled}
            onCheckedChange={onSoundEnabled}
            aria-label={t("sound")}
          />
        </div>
      </Card>

      {/* 自动收起面板 */}
      <Card className="p-4 rounded-2xl border-border/30 bg-muted/20">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Label>{t("autoHide")}</Label>
            <p className="text-xs text-muted-foreground mt-0.5">{t("autoHideDesc")}</p>
          </div>
          <Switch
            checked={autoHide}
            onCheckedChange={onAutoHide}
            aria-label={t("autoHide")}
          />
        </div>
      </Card>

      {/* 结果显示密度 */}
      <Card className="p-4 rounded-2xl border-border/30 bg-muted/20 space-y-3">
        <div>
          <Label>{t("density")}</Label>
          <p className="text-xs text-muted-foreground mt-0.5">{t("densityDesc")}</p>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {(["comfortable", "compact"] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => onDensity(d)}
              className={[
                "h-10 rounded-xl text-sm font-medium transition-colors border",
                density === d
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border/30 text-muted-foreground hover:bg-background",
              ].join(" ")}
              aria-pressed={density === d}
            >
              {t(d === "comfortable" ? "densityComfortable" : "densityCompact")}
            </button>
          ))}
        </div>
      </Card>

      {/* 重置所有选项 */}
      <Card className="p-4 rounded-2xl border-border/30 bg-muted/20">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Label>{t("resetSettings")}</Label>
            <p className="text-xs text-muted-foreground mt-0.5">{t("resetSettingsDesc")}</p>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="h-9 px-3 rounded-xl text-sm font-medium border border-border/30 text-destructive hover:bg-destructive/10 transition-colors"
          >
            {t("resetSettings")}
          </button>
        </div>
      </Card>
    </div>
  );
}
