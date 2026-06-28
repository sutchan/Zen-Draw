// components/draw/settings-panel/sidebar-toggle.tsx —— 侧边栏开关按钮
"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createTranslator } from "@/lib/i18n";

export function SidebarToggle({
  open,
  onToggle,
  language,
}: {
  open: boolean;
  onToggle: () => void;
  language: "zh" | "en";
}) {
  const t = React.useMemo(() => createTranslator(language), [language]);
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="absolute top-4 right-4 lg:right-8 z-50"
    >
      <Button
        variant={open ? "secondary" : "ghost"}
        size="icon"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls="settings-panel"
        title={t("toggleUI")}
        aria-label={t("toggleUI")}
        className="rounded-xl transition-all duration-300 hover:scale-105"
      >
        {open ? (
          <X className="w-5 h-5" aria-hidden="true" />
        ) : (
          <Menu className="w-5 h-5" aria-hidden="true" />
        )}
      </Button>
    </motion.div>
  );
}
