// components/draw/settings-panel/experience-settings.tsx v5.7.4 —— 体验设置（音效/彩屑/减弱动效/密度/重置）
"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { createTranslator } from "@/lib/i18n";

export function ExperienceSettings({
  language,
  soundEnabled,
  onSoundEnabled,
  confettiEnabled,
  onConfettiEnabled,
  reduceMotion,
  onReduceMotion,
  autoHide,
  onAutoHide,
  density,
  onDensity,
  onReset,
}: {
  language: "zh" | "en";
  soundEnabled: boolean;
  onSoundEnabled: (value: boolean) => void;
  confettiEnabled: boolean;
  onConfettiEnabled: (value: boolean) => void;
  reduceMotion: boolean;
  onReduceMotion: (value: boolean) => void;
  autoHide: boolean;
  onAutoHide: (value: boolean) => void;
  density: "comfortable" | "compact";
  onDensity: (value: "comfortable" | "compact") => void;
  onReset: () => void;
}) {
  const t = React.useMemo(() => createTranslator(language), [language]);

  return (
    <div id="experience-settings" className="space-y-5 pt-2">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
        {t("experience")}
      </p>

      {/* 音效 */}
      <Card id="experience-sound-card" className="p-4 rounded-2xl border-border/30 bg-muted/20">
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

      {/* 结果彩屑动效 */}
      <Card id="experience-confetti-card" className="p-4 rounded-2xl border-border/30 bg-muted/20">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Label>{t("confetti")}</Label>
            <p className="text-xs text-muted-foreground mt-0.5">{t("confettiDesc")}</p>
          </div>
          <Switch
            checked={confettiEnabled}
            onCheckedChange={onConfettiEnabled}
            aria-label={t("confetti")}
          />
        </div>
      </Card>

      {/* 减弱动效 */}
      <Card id="experience-reduce-motion-card" className="p-4 rounded-2xl border-border/30 bg-muted/20">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Label>{t("reduceMotion")}</Label>
            <p className="text-xs text-muted-foreground mt-0.5">{t("reduceMotionDesc")}</p>
          </div>
          <Switch
            checked={reduceMotion}
            onCheckedChange={onReduceMotion}
            aria-label={t("reduceMotion")}
          />
        </div>
      </Card>

      {/* 自动收起面板 */}
      <Card id="experience-autohide-card" className="p-4 rounded-2xl border-border/30 bg-muted/20">
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
      <Card id="experience-density-card" className="p-4 rounded-2xl border-border/30 bg-muted/20 space-y-3">
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
      <Card id="experience-reset-card" className="p-4 rounded-2xl border-border/30 bg-muted/20">
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
