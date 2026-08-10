// components/draw/draw-settings.tsx v5.7.4 —— 抽取设置子组件（使用中央翻译系统）
"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { createTranslator } from "@/lib/i18n";

export function DrawSettings({
  language,
  min, max,
  count,
  duration,
  allowDuplicates, useCustomList,
  onMin, onMax,
  onCount,
  onDuration,
  onAllowDuplicates,
  onUseCustomList,
}: {
  language: "zh" | "en";
  min: number;
  max: number;
  count: number;
  duration: number;
  allowDuplicates: boolean;
  useCustomList: boolean;
  onMin: (value: number | string) => void;
  onMax: (value: number | string) => void;
  onCount: (value: number | string) => void;
  onDuration: (value: number | string) => void;
  onAllowDuplicates: (value: boolean) => void;
  onUseCustomList: (value: boolean) => void;
}) {
  const t = React.useMemo(() => createTranslator(language), [language]);

  return (
    <motion.div
      id="draw-settings"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="space-y-5 pt-2"
    >
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
        {t("drawSettings")}
      </p>

      {/* 抽取范围 */}
      <Card id="draw-range-card" className="p-4 rounded-2xl border-border/30 bg-muted/20 grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="min-val">{t("minVal")}</Label>
          <Input
            id="min-val"
            type="number"
            value={min}
            onChange={(e) => onMin(e.target.value)}
            className="h-11 rounded-xl bg-background border-border/20 focus:ring-2 focus:ring-primary/15 transition-all"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="max-val">{t("maxVal")}</Label>
          <Input
            id="max-val"
            type="number"
            value={max}
            onChange={(e) => onMax(e.target.value)}
            className="h-11 rounded-xl bg-background border-border/20 focus:ring-2 focus:ring-primary/15 transition-all"
          />
        </div>
      </Card>

      {/* 抽取数量 */}
      <Card id="draw-count-card" className="p-4 rounded-2xl border-border/30 bg-muted/20 space-y-3">
        <div className="flex items-center justify-between">
          <Label>{t("drawCount")}</Label>
          <span className="text-sm font-semibold tabular-nums rounded-lg bg-background px-2.5 py-1 border border-border/20">
            {count}
          </span>
        </div>
        <Slider
          value={[count]}
          min={1}
          max={100}
          step={1}
          onValueChange={(v) => onCount(String(v[0]))}
          aria-label={t("drawCount")}
        />
      </Card>

      {/* 抽取时长 */}
      <Card id="draw-duration-card" className="p-4 rounded-2xl border-border/30 bg-muted/20 space-y-3">
        <div className="flex items-center justify-between">
          <Label>{t("drawDuration")}</Label>
          <span className="text-sm font-semibold tabular-nums rounded-lg bg-background px-2.5 py-1 border border-border/20">
            {duration}
            <span className="text-muted-foreground font-normal"> s</span>
          </span>
        </div>
        <Slider
          value={[duration]}
          min={0}
          max={30}
          step={1}
          onValueChange={(v) => onDuration(String(v[0]))}
          aria-label={t("drawDuration")}
        />
        <p className="text-xs text-muted-foreground leading-relaxed">{t("drawDurationDesc")}</p>
      </Card>

      {/* 允许重复 */}
      <Card id="draw-allow-dup-card" className="p-4 rounded-2xl border-border/30 bg-muted/20">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Label>{t("allowDup")}</Label>
            <p className="text-xs text-muted-foreground mt-0.5">{t("allowDupDesc")}</p>
          </div>
          <Switch
            checked={allowDuplicates}
            onCheckedChange={onAllowDuplicates}
            aria-label={t("allowDup")}
          />
        </div>
      </Card>

      {/* 使用自定义名单 */}
      <Card id="draw-custom-list-card" className="p-4 rounded-2xl border-border/30 bg-muted/20">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Label>{t("useCustomList")}</Label>
            <p className="text-xs text-muted-foreground mt-0.5">{t("customListHint")}</p>
          </div>
          <Switch
            checked={useCustomList}
            onCheckedChange={onUseCustomList}
            aria-label={t("useCustomList")}
          />
        </div>
      </Card>
    </motion.div>
  );
}
