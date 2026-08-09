"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  size = "md",
  ...props
}: CheckboxPrimitive.Root.Props & { size?: "sm" | "md" }) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "group/checkbox inline-flex items-center justify-center rounded-[min(var(--radius-sm),8px)] border border-input bg-background outline-none transition-all",
        "focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:border-ring",
        "data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground",
        "disabled:pointer-events-none disabled:opacity-50",
        size === "sm" ? "size-4" : "size-[1.125rem]",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex size-full items-center justify-center"
      >
        <CheckIcon className="size-3.5" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
