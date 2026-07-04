// app/not-found.tsx v5.0.0 — 404 页面（i18n + lucide 图标）
"use client";

import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import { createTranslator } from "@/lib/i18n";

export default function NotFound() {
  const language = useLanguage();
  const t = createTranslator(language);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <FileQuestion className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{t("notFoundTitle")}</h1>
        <p className="text-muted-foreground text-sm max-w-md">{t("notFoundDesc")}</p>
      </div>
      <Link
        href="/"
        className={cn(buttonVariants({ variant: "default" }), "rounded-full px-6 py-3")}
      >
        {t("notFoundBackHome")}
      </Link>
    </div>
  );
}
