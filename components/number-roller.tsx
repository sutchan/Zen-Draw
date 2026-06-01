// components/number-roller.tsx v2.7.0
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
  const textStyles = "bg-clip-text text-transparent bg-gradient-to-br from-foreground via-primary to-foreground/80"

  // Vary speed based on index: slower for later digits
  const baseDuration = 0.08
  const duration = baseDuration + (index * 0.025)

  if (!isDigit || shouldReduceMotion) {
    return (
      <div className="flex items-center justify-center min-w-[0.3em] px-0.5">
        <span className={cn("inline-block font-black", textStyles)}>{char}</span>
      </div>
    )
  }

  return (
    <div className="relative h-[1.2em] w-[0.7em] sm:w-[0.8em] overflow-hidden flex flex-col items-center flex-shrink-0">
      {/* Glow effect when rolling */}
      {isDrawing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="absolute inset-0 bg-primary/20 blur-xl rounded-full -z-10"
        />
      )}
      
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
              <span key={i} className={cn("h-[1.2em] w-full flex items-center justify-center font-black", textStyles)}>
                {n}
              </span>
            ))}
          </motion.div>
        ) : (
          <motion.span
            key={char}
            initial={{ y: "100%", opacity: 0, scale: 0.8 }}
            animate={{ y: "0%", opacity: 1, scale: 1 }}
            exit={{ y: "-100%", opacity: 0, scale: 0.8 }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 25,
              mass: 0.8,
            }}
            className={cn("h-[1.2em] w-full flex items-center justify-center font-black", textStyles)}
          >
            {char}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}
