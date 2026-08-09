"use client"

import * as React from "react"
import {
  Toast as ToastPrimitive,
  type ToastProviderProps,
  type ToastViewportProps,
  type ToastRootProps,
  type ToastTitleProps,
  type ToastDescriptionProps,
  type ToastCloseProps,
} from "@base-ui/react/toast"

import { cn } from "@/lib/utils"

function ToastProvider({ timeout = 2500, limit = 3, ...props }: ToastProviderProps) {
  return (
    <ToastPrimitive.Provider
      data-slot="toast-provider"
      timeout={timeout}
      limit={limit}
      {...props}
    />
  )
}

function ToastViewport({ className, ...props }: ToastViewportProps) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        "fixed bottom-[max(var(--spacing-6),env(safe-area-inset-bottom))] left-1/2 z-100 flex w-[min(380px,calc(100vw-2rem))] -translate-x-1/2 flex-col gap-2 outline-none",
        className
      )}
      {...props}
    />
  )
}

function Toast({ className, ...props }: ToastRootProps) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      className={cn(
        "rounded-lg border border-border bg-background p-4 text-sm shadow-lg",
        "origin-[var(--toast-transform-origin)] transition-all duration-200 ease-out",
        "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
        "data-[starting-style]:translate-y-2 data-[ending-style]:translate-y-2",
        className
      )}
      {...props}
    />
  )
}

function ToastTitle({ className, ...props }: ToastTitleProps) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn("font-medium text-foreground", className)}
      {...props}
    />
  )
}

function ToastDescription({ className, ...props }: ToastDescriptionProps) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  )
}

function ToastClose({ className, ...props }: ToastCloseProps) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      className={cn(
        "absolute right-2 top-2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40",
        className
      )}
      {...props}
    />
  )
}

/**
 * 轻量全局 toast 助手 — 在 ToastProvider 内任意位置调用。
 */
function useToast() {
  const { add } = ToastPrimitive.useToastManager()
  return React.useCallback(
    (message: string, opts?: { title?: string; priority?: "low" | "high"; type?: string }) => {
      add({
        title: opts?.title,
        description: message,
        type: opts?.type ?? "success",
        priority: opts?.priority ?? "low",
      })
    },
    [add]
  )
}

export {
  Toast,
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
  ToastClose,
  useToast,
}
