// use-keyboard-shortcuts.ts v5.0 —— 全局键盘快捷键 Hook
"use client";

import * as React from "react";
import type { UseDrawReturn } from "./draw-types";

interface UseKeyboardShortcutsOptions {
  /** 抽签 API（来自 useDraw） */
  draw: UseDrawReturn;
  /** 设置面板是否打开 */
  panelOpen: boolean;
  /** 关闭设置面板 */
  setPanelOpen: (open: boolean) => void;
}

/**
 * 全局键盘快捷键：
 * - Esc：关闭已打开的设置面板
 * - Space（非输入态、面板关闭时）：开始/停止抽取
 *
 * 使用 ref 持有最新 draw，避免 effect 频繁重建监听器。
 */
export function useKeyboardShortcuts({
  draw,
  panelOpen,
  setPanelOpen,
}: UseKeyboardShortcutsOptions): void {
  const drawRef = React.useRef(draw);

  React.useEffect(() => {
    drawRef.current = draw;
  }, [draw]);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (e.key === "Escape") {
        if (panelOpen) {
          setPanelOpen(false);
          e.preventDefault();
        }
        return;
      }

      if (e.key === " " && !isTyping && !panelOpen && target?.tagName !== "BUTTON") {
        e.preventDefault();
        const currentDraw = drawRef.current;
        if (currentDraw.status === "drawing") currentDraw.stopDraw();
        else if (currentDraw.canDraw) currentDraw.startDraw();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [panelOpen, setPanelOpen]);
}
