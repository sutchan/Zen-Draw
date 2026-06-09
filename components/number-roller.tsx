// components/number-roller.tsx v3.0
"use client"

import * as React from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

interface NumberRollerProps {
  value: string
  isDrawing: boolean
  className?: string
}

export function NumberRoller({ value, isDrawing, className }: NumberRollerProps) {
  const characters = value.split("")
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className={cn("flex items-center justify-center tabular-nums", className)}>
      {characters.map((char, index) => (
        <CharacterSlot key={index} index={index} char={char} isDrawing={isDrawing} shouldReduceMotion={shouldReduceMotion} />
      ))}
    </div>
  )
}

function CharacterSlot({ index, char, isDrawing, shouldReduceMotion }: { index: number; char: string; isDrawing: boolean; shouldReduceMotion: boolean | null }) {
  const isDigit = /\d/.test(char)
  const textStyles = "bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/80"

  // Vary speed based on index: slower for later digits
  const baseDuration = 0.1
  const duration = baseDuration + (index * 0.03)

  if (!isDigit || shouldReduceMotion) {
    return (
      <div className="flex items-center justify-center min-w-[0.3em] px-0.5">
        <span className={cn("inline-block", textStyles)}>{char}</span>
      </div>
    )
  }

  return (
    <div className="relative h-[1.2em] w-[0.65em] sm:w-[0.75em] overflow-hidden flex flex-col items-center flex-shrink-0">
      <AnimatePresence mode="popLayout">
        {isDrawing ? (
          <motion.div
            key="rolling"
            initial={{ y: "0%" }}
            animate={{ y: "-90%" }}
            transition={{
              repeat: Infinity,
              duration: duration,
              ease: "linear",
            }}
            className="flex flex-col w-full"
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n, i) => (
              <span key={i} className={cn("h-[1.2em] w-full flex items-center justify-center", textStyles)}>
                {n}
              </span>
            ))}
          </motion.div>
        ) : (
          <motion.span
            key={char}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              mass: 1,
            }}
            className={cn("h-[1.2em] w-full flex items-center justify-center", textStyles)}
          >
            {char}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}
