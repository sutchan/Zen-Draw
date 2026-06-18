// components/theme-toggle.tsx v3.1
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  // 使用 useSyncExternalStore 实现"客户端已挂载"检测，避免 useEffect 内同步 setState
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark");

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={className}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <Sun
        className={
          "h-[1.2rem] w-[1.2rem] transition-all " +
          (isDark ? "rotate-90 scale-0" : "rotate-0 scale-100")
        }
        aria-hidden="true"
      />
      <Moon
        className={
          "absolute h-[1.2rem] w-[1.2rem] transition-all " +
          (isDark ? "rotate-0 scale-100" : "-rotate-90 scale-0")
        }
        aria-hidden="true"
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
