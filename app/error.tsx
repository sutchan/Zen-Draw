"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { createTranslator } from "@/lib/i18n";
import { useStoredLanguage } from "@/hooks/use-stored-language";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const lang = useStoredLanguage();

  React.useEffect(() => {
    console.error("ZenDraw Error:", error);
  }, [error]);

  const t = createTranslator(lang);

  return (
    <div id="error-page" className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8 text-destructive"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="16" y1="16" x2="16.01" />
        </svg>
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{t("pageErrorTitle")}</h1>
        <p className="text-muted-foreground text-sm max-w-md">
          {t("pageErrorDesc")}
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={reset} variant="default" className="rounded-full">
          {t("retry")}
        </Button>
        <Button
          onClick={() => (window.location.href = "/")}
          variant="outline"
          className="rounded-full"
        >
          {t("backHome")}
        </Button>
      </div>
    </div>
  );
}
