// components/draw/custom-list-settings.tsx v3.0 —— 自定义列表子组件
"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { sanitizeListInput } from "@/lib/utils";

export function CustomListSettings({
  t,
  language,
  useCustomList,
  customList,
  onUseCustomListChange,
  onImport,
}: {
  t: { custom: string; useCustomList: string; itemsLoaded: string; noItems: string; importList: string; exportList: string };
  language: "zh" | "en";
  useCustomList: boolean;
  customList: string[];
  onUseCustomListChange: (value: boolean) => void;
  onImport: (items: string[]) => void;
}) {
  const isZH = language === "zh";
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [importText, setImportText] = React.useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="space-y-6 pt-2"
    >
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
        {t.custom}
      </p>

      <div className="flex items-center justify-between py-3 border-b border-border/20">
        <div className="space-y-0.5">
          <label htmlFor="use-custom" className="cursor-pointer text-sm font-medium">
            {t.useCustomList}
          </label>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {customList.length > 0 ? `${customList.length} ${t.itemsLoaded}` : t.noItems}
          </p>
        </div>
        <button
          role="switch"
          aria-checked={useCustomList}
          onClick={() => onUseCustomListChange(!useCustomList)}
          className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          data-state={useCustomList ? "checked" : "unchecked"}
        >
          <span
            className="data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-[2px] inline-block h-5 w-5 rounded-full bg-background shadow-lg ring-1 ring-black/5 transition-transform duration-200"
          />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={() => {
            setImportText(customList.join("\n"));
            setDialogOpen(true);
          }}
          className="h-11 rounded-xl hover:bg-muted/50 transition-colors border-border/30"
        >
          {t.importList}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            const data = customList.join("\n");
            if (data) {
              const blob = new Blob([data], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "custom-list.txt";
              a.style.display = "none";
              document.body.appendChild(a);
              a.click();
              setTimeout(() => {
                URL.revokeObjectURL(url);
                document.body.removeChild(a);
              }, 200);
            }
          }}
          className="h-11 rounded-xl hover:bg-muted/50 transition-colors border-border/30"
        >
          {t.exportList}
        </Button>
      </div>

      {/* 导入 Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setDialogOpen(false)} />
          <div className="relative z-50 bg-background rounded-2xl border border-border/30 p-6 max-w-[520px] w-full mx-4">
            <h3 className="text-xl font-semibold mb-2">
              {t.importList}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {isZH ? "每行一个项目，提交后将作为抽取池" : "One item per line, will be used as the draw pool"}
            </p>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder={isZH ? "苹果\n香蕉\n橙子..." : "Apple\nBanana\nOrange..."}
              className="min-h-[240px] w-full rounded-xl resize-none bg-muted/30 border border-border/20 p-4 text-sm font-mono focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
            />
            <div className="flex gap-2 mt-4 justify-end">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="flex-1 h-11 rounded-xl border-border/30"
              >
                {isZH ? "取消" : "Cancel"}
              </Button>
              <Button
                onClick={() => {
                  const items = sanitizeListInput(importText);
                  if (items.length > 0) {
                    onImport(items);
                  }
                  setDialogOpen(false);
                }}
                className="flex-1 h-11 rounded-xl"
              >
                {isZH ? "确认导入" : "Import"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
