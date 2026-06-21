// components/ui/tabs.tsx v1.0 — 纯 React + Tailwind Tabs
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ---------- Context ----------
interface TabsContextValue {
  value: string;
  setValue: (v: string) => void;
  isInitialized: boolean;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);
const TabsListContext = React.createContext<boolean>(false);

function useTabsContext(name: string): TabsContextValue {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error(`Tabs.${name} must be inside <Tabs>`);
  return ctx;
}

// ---------- Root ----------
interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (v: string) => void;
  children: React.ReactNode;
}

function TabsRoot({
  defaultValue,
  value: controlledValue,
  onValueChange,
  className,
  children,
  ...props
}: TabsProps): React.ReactNode {
  const [internalValue, setInternalValue] = React.useState<string>(defaultValue ?? "");
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const setValue = React.useCallback(
    (v: string) => {
      if (!isControlled) setInternalValue(v);
      onValueChange?.(v);
    },
    [isControlled, onValueChange]
  );

  return (
    <TabsContext.Provider value={{ value, setValue, isInitialized: true }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

// ---------- List ----------
interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

function TabsList({ className, children, ...props }: TabsListProps): React.ReactNode {
  return (
    <TabsListContext.Provider value={true}>
      <div
        role="tablist"
        className={cn(
          "inline-flex h-10 items-center justify-center gap-1 rounded-lg bg-muted p-1 text-muted-foreground",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </TabsListContext.Provider>
  );
}

// ---------- Trigger ----------
interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, children, value, ...props }, ref) => {
    const { value: currentValue, setValue } = useTabsContext("Trigger");
    const active = currentValue === value;
    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={active}
        data-state={active ? "active" : "inactive"}
        onClick={() => setValue(value)}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          active ? "bg-background text-foreground shadow-sm" : "hover:text-foreground",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

// ---------- Content ----------
interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

function TabsContent({ value, className, children, ...props }: TabsContentProps): React.ReactNode {
  const { value: currentValue, isInitialized } = useTabsContext("Content");
  const active = currentValue === value;
  if (!active) {
    // 保持 DOM 存在以便 React 动画，但在非激活时隐藏
    return null;
  }
  return (
    <div
      role="tabpanel"
      data-state={active ? "active" : "inactive"}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      {isInitialized && children}
    </div>
  );
}

// ---------- 组合导出 ----------
export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});

// 兼容 shadcn/ui 风格的显式命名导出
export { TabsList, TabsTrigger, TabsContent };
