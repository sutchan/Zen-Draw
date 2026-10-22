"use client";

import * as React from "react";
import Link from "next/link";
import { createTranslator } from "@/lib/i18n";
import { useStoredLanguage } from "@/hooks/use-stored-language";

export default function NotFound() {
  const lang = useStoredLanguage();

  const t = createTranslator(lang);

  return (
    <div id="not-found-page" className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8 text-muted-foreground"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{t("notFoundTitle")}</h1>
        <p className="text-muted-foreground text-sm max-w-md">
          {t("notFoundDesc")}
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
