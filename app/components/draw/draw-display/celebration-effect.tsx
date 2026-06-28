// components/draw/draw-display/celebration-effect.tsx —— 结果揭晓庆祝光晕
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles } from "lucide-react";

export function CelebrationEffect({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: [0, 0.5, 0], scale: [0.6, 1.15, 1] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center"
          aria-hidden="true"
        >
          {/* 径向渐变光晕 */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse, hsl(var(--primary) / 0.15) 0%, transparent 70%)",
            }}
          />
          {/* 闪烁星星 */}
          <motion.div
            animate={{ scale: [1, 1.3, 0], opacity: [0.5, 1, 0] }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <Sparkles
              className="text-primary/25"
              style={{ width: "12rem", height: "12rem" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
