// components/draw/draw-display/welcome-screen.tsx —— 空闲状态显示
"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Dices } from "lucide-react";
import { createTranslator } from "@/lib/i18n";

export function WelcomeScreen({ language }: { language: "zh" | "en" }) {
  const t = React.useMemo(() => createTranslator(language), [language]);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col items-center justify-center text-center"
      role="status"
      aria-live="polite"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        aria-hidden="true"
      >
        <Dices
          className="text-muted-foreground/20 mb-8"
          style={{ width: "10rem", height: "10rem" }}
          aria-hidden="true"
        />
      </motion.div>
      <div className="space-y-3">
        <p className="text-5xl md:text-6xl lg:text-7xl text-foreground/85 font-semibold tracking-tight leading-tight">
          {t("ready")}
        </p>
        <p className="text-base md:text-lg text-muted-foreground/60">{t("welcomeHint")}</p>
      </div>
    </motion.div>
  );
}
