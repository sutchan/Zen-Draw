// components/draw/draw-settings.tsx v3.1 —— 抽取设置子组件（使用中央翻译系统）
"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createTranslator } from "@/lib/i18n";

export function DrawSettings({
  language,
  useCustomList,
  min, max, count, duration,
  allowDuplicates, autoHide,
  onMin, onMax, onCount, onDuration,
  onAllowDuplicates, onAutoHide,
}: {
  language: "zh" | "en";
  useCustomList: boolean;
  min: number;
  max: number;
  count: number;
  duration: number;
  allowDuplicates: boolean;
  autoHide: boolean;
  onMin: (value: number | string) => void;
  onMax: (value: number | string) => void;
  onCount: (value: number | string) => void;
  onDuration: (value: number | string) => void;
  onAllowDuplicates: (value: boolean) => void;
  onAutoHide: (value: boolean) => void;
}) {
  const t = React.useMemo(() => createTranslator(language), [language]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="space-y-6 pt-2"
    >
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
        {t("drawSettings")}
      </p>

      {/* 数值范围 */}
      {!useCustomList && (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="min-value">{t("minVal")}</Label>
            <Input
              id="min-value"
              type="number"
              value={min}
              onChange={(e) => onMin(e.target.value)}
              className="h-11 rounded-2xl bg-muted/30 border border-border/20 focus:ring-2 focus:ring-primary/15 focus:bg-background transition-all"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-value">{t("maxVal")}</Label>
            <Input
              id="max-value"
              type="number"
              value={max}
              onChange={(e) => onMax(e.target.value)}
              className="h-11 rounded-2xl bg-muted/30 border border-border/20 focus:ring-2 focus:ring-primary/15 focus:bg-background transition-all"
            />
          </div>
        </div>
      )}

      {/* 抽取数量 */}
      <div className="space-y-2">
        <Label htmlFor="draw-count">{t("drawCount")}</Label>
        <Input
          id="draw-count"
          type="number"
          min={1}
          max={1000}
          value={count}
          onChange={(e) => onCount(e.target.value)}
          className="h-11 rounded-2xl bg-muted/30 border border-border/20 focus:ring-2 focus:ring-primary/15 focus:bg-background transition-all"
        />
      </div>

      {/* 动画时长 */}
      <div className="space-y-2">
        <Label htmlFor="draw-duration">{t("drawDuration")}</Label>
        <Input
          id="draw-duration"
          type="number"
          min={1}
          max={120}
          value={duration}
          onChange={(e) => onDuration(e.target.value)}
          className="h-11 rounded-2xl bg-muted/30 border border-border/20 focus:ring-2 focus:ring-primary/15 focus:bg-background transition-all"
        />
        <p className="text-xs text-muted-foreground leading-relaxed">{t("drawDurationDesc")}</p>
      </div>

      {/* 选项开关 */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between py-2 border-b border-border/20">
          <div className="space-y-0.5">
            <Label htmlFor="allow-duplicates" className="cursor-pointer text-sm font-medium">
              {t("allowDup")}
            </Label>
          </div>
          <Switch
            id="allow-duplicates"
            checked={allowDuplicates}
            onCheckedChange={onAllowDuplicates}
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <Label htmlFor="auto-hide" className="cursor-pointer text-sm font-medium">
              {t("autoHide")}
            </Label>
            <p className="text-xs text-muted-foreground leading-relaxed">{t("autoHideDesc")}</p>
          </div>
          <Switch
            id="auto-hide"
            checked={autoHide}
            onCheckedChange={onAutoHide}
          />
        </div>
      </div>
    </motion.div>
  );
}
