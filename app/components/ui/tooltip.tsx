"use client"

import * as React from "react"
import {
  Tooltip as TooltipPrimitive,
  type TooltipProviderProps,
} from "@base-ui/react/tooltip"

import { cn } from "@/lib/utils"

function TooltipProvider({ delay, closeDelay, ...props }: TooltipProviderProps) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay ?? 200}
      closeDelay={closeDelay ?? 0}
      {...props}
    />
  )
}

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  sideOffset = 6,
  children,
  ...props
}: TooltipPrimitive.Popup.Props & { sideOffset?: number }) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner sideOffset={sideOffset} align="center">
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            "z-50 rounded-md bg-foreground px-2.5 py-1.5 text-xs font-medium text-background shadow-md",
            "origin-[var(--transform-origin)] transition-[transform,opacity] duration-150",
            "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
            "data-[starting-style]:scale-95 data-[ending-style]:scale-95",
            className
          )}
          {...props}
        >
          {children}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
