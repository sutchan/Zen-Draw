// components/draw/custom-list-settings.tsx v5.5.0 —— 自定义列表设置子组件（使用中央翻译系统 + base-ui Dialog）
"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { createTranslator } from "@/lib/i18n";

export function CustomListSettings({
  language,
  open,
  onOpenChange,
  customList,
  onCustomListChange,
}: {
  language: "zh" | "en";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customList: string[];
  onCustomListChange: (list: string[]) => void;
}) {
  const t = React.useMemo(() => createTranslator(language), [language]);
  const initialText = React.useMemo(() => customList.join("\n"), [customList]);
  const [text, setText] = React.useState(initialText);
  const [error, setError] = React.useState<string | null>(null);

  // 通过 key 重挂载使下方 useState 以最新列表重新初始化（避免 setState-in-effect）
  const handleSave = React.useCallback(() => {
    const items = text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    if (items.length === 0) {
      setError(t("listHintEmpty"));
      return;
    }
    // 自动去重后保存，不再阻断（提示文案改为保存后轻提示）
    const unique = Array.from(new Set(items));
    onCustomListChange(unique);
    if (unique.length !== items.length) {
      setError(t("duplicateItemsWarning", String(items.length - unique.length)));
    } else if (error) {
      setError(null);
    }
    onOpenChange(false);
  }, [text, onCustomListChange, onOpenChange, t, error]);

  return (
    <Dialog open={open} onOpenChange={(next) => {
      if (!next) setError(null);
      onOpenChange(next);
    }}>
      <DialogContent key={open ? "open" : "closed"} className="sm:max-w-lg" aria-label={t("customList")}>
        <DialogHeader>
          <DialogTitle>{t("customList")}</DialogTitle>
          <DialogDescription>{t("customListHint")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-1">
          <Textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (error) setError(null);
            }}
            placeholder={t("listPlaceholder")}
            className="min-h-[220px] resize-y rounded-2xl font-mono text-sm bg-muted/30 border border-border/20 focus:ring-2 focus:ring-primary/15 focus:bg-background transition-all"
            aria-label={t("customList")}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {customList.length > 0 ? `${customList.length} ${t("itemsLoaded")}` : t("listHintEmpty")}
            </span>
            {error && <span className="text-destructive">{error}</span>}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <DialogClose className="h-10 rounded-xl px-4 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
            {t("cancel")}
          </DialogClose>
          <Button type="button" onClick={handleSave} className="rounded-xl">
            {t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
