// components/ui/select.tsx v1.0 — 纯 React + Tailwind Select
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ---------- Select Context ----------
interface SelectContextValue {
  value: string;
  setValue: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  listboxId: string;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelectContext(componentName: string): SelectContextValue {
  const ctx = React.useContext(SelectContext);
  if (!ctx) {
    throw new Error(`Select.${componentName} must be used within <Select>`);
  }
  return ctx;
}

// ---------- Select Root ----------
interface SelectProps {
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  name?: string;
  id?: string;
}

function SelectRoot({
  children,
  value: controlledValue,
  defaultValue,
  onValueChange,
  disabled,
  name,
  id,
}: SelectProps): React.ReactNode {
  const [internalValue, setInternalValue] = React.useState<string>(
    defaultValue ?? ""
  );
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const listboxId = React.useId();

  const setValue = React.useCallback(
    (v: string) => {
      if (!isControlled) setInternalValue(v);
      onValueChange?.(v);
    },
    [isControlled, onValueChange]
  );

  // 点击外部关闭
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const root = triggerRef.current?.closest("[data-select-root]");
      if (root && !root.contains(target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // 键盘 Escape 关闭
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <SelectContext.Provider
      value={{ value, setValue, open, setOpen, triggerRef, listboxId }}
    >
      <div
        data-select-root
        data-name={name}
        data-id={id}
        data-disabled={disabled ? "" : undefined}
        className={cn("relative inline-block w-full", disabled && "opacity-50 pointer-events-none")}
      >
        {children}
      </div>
    </SelectContext.Provider>
  );
}

// ---------- SelectTrigger ----------
interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, forwardedRef) => {
    const { open, setOpen, triggerRef, value, listboxId } = useSelectContext("Trigger");

    // 合并 ref
    React.useEffect(() => {
      if (forwardedRef && typeof forwardedRef !== "function") {
        (forwardedRef as React.MutableRefObject<HTMLButtonElement | null>).current =
          triggerRef.current;
      }
    }, [forwardedRef, triggerRef]);

    return (
      <button
        type="button"
        ref={triggerRef}
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-haspopup="listbox"
        aria-label={typeof children === "string" ? children : "Select an option"}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children ?? <span className="text-muted-foreground">{value || "Select..."}</span>}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("h-4 w-4 opacity-60 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

// ---------- SelectValue ----------
interface SelectValueProps {
  placeholder?: string;
  children?: React.ReactNode;
  className?: string;
}

function SelectValueImpl({
  placeholder,
  children,
  className,
}: SelectValueProps): React.ReactNode {
  const { value } = useSelectContext("Value");
  return (
    <span className={cn("truncate text-left", className)}>
      {children ?? (value ? value : placeholder ? <span className="text-muted-foreground">{placeholder}</span> : null)}
    </span>
  );
}

// ---------- SelectContent ----------
interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  position?: "popper" | "item-aligned";
}

function SelectContent({
  children,
  className,
  position = "popper",
  ...props
}: SelectContentProps): React.ReactNode {
  const { open, listboxId } = useSelectContext("Content");
  if (!open) return null;

  return (
    <div
      id={listboxId}
      role="listbox"
      className={cn(
        "absolute left-0 right-0 z-50 mt-1 overflow-hidden rounded-md border border-border bg-background text-foreground shadow-lg animate-in fade-in-0 zoom-in-95",
        position === "item-aligned" && "mt-2",
        className
      )}
      {...props}
    >
      <div className="max-h-64 overflow-y-auto py-1">{children}</div>
    </div>
  );
}

// ---------- SelectItem ----------
interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

function SelectItem({ value, children, className, ...props }: SelectItemProps): React.ReactNode {
  const { value: currentValue, setValue, setOpen } = useSelectContext("Item");
  const isSelected = currentValue === value;
  return (
    <div
      role="option"
      aria-selected={isSelected}
      tabIndex={0}
      onClick={() => {
        setValue(value);
        setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setValue(value);
          setOpen(false);
        }
      }}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        isSelected && "bg-accent/50 text-accent-foreground",
        className
      )}
      {...props}
    >
      {isSelected && (
        <span className="absolute left-1 top-1/2 -translate-y-1/2 text-xs" aria-hidden="true">
          ✓
        </span>
      )}
      <span className={cn("truncate", isSelected && "pl-4")}>{children}</span>
    </div>
  );
}

// ---------- SelectGroup / Label / Separator ----------
interface SelectGroupProps extends React.HTMLAttributes<HTMLDivElement> {}
function SelectGroup({ children, className, ...props }: SelectGroupProps): React.ReactNode {
  return <div role="group" className={className} {...props}>{children}</div>;
}
SelectGroup.displayName = "SelectGroup";

interface SelectLabelProps extends React.HTMLAttributes<HTMLDivElement> {}
function SelectLabel({ children, className, ...props }: SelectLabelProps): React.ReactNode {
  return (
    <div
      className={cn("px-2 py-1.5 text-xs font-semibold text-muted-foreground", className)}
      {...props}
    >
      {children}
    </div>
  );
}
SelectLabel.displayName = "SelectLabel";

interface SelectSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}
function SelectSeparator({ className, ...props }: SelectSeparatorProps): React.ReactNode {
  return <div role="separator" className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />;
}
SelectSeparator.displayName = "SelectSeparator";

// ---------- 组合导出 ----------
export const Select = Object.assign(SelectRoot, {
  Trigger: SelectTrigger,
  Value: SelectValueImpl,
  Content: SelectContent,
  Item: SelectItem,
  Group: SelectGroup,
  Label: SelectLabel,
  Separator: SelectSeparator,
});

// 兼容 shadcn/ui 风格的显式命名导出
export { SelectTrigger, SelectContent, SelectItem, SelectGroup, SelectLabel, SelectSeparator };
export const SelectValue = SelectValueImpl;
