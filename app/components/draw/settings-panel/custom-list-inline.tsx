// components/draw/settings-panel/custom-list-inline.tsx v5.7.6 —— 自定义列表内联卡片
"use client";

import * as React from "react";
import { createTranslator } from "@/lib/i18n";

export function CustomListInline({
  t, customList, useCustomList, onOpenDialog, onClearList,
}: {
  t: ReturnType<typeof createTranslator>;
  customList: string[];
  useCustomList: boolean;
  onOpenDialog: () => void;
  onClearList: () => void;
}) {
  return (
    <div id="custom-list-inline" className="rounded-2xl border border-border/30 bg-muted/20 p-4 space-y-3">
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
