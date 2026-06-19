// components/ui/switch.tsx v1.0 — 纯 React Switch（无障碍）
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, "onChange" | "children"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  id?: string;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      className,
      checked: controlledChecked,
      defaultChecked,
      onCheckedChange,
      disabled,
      required,
      name,
      value,
      id,
      ...props
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = React.useState<boolean>(
      defaultChecked ?? false
    );
    const isControlled = controlledChecked !== undefined;
    const checked = isControlled ? controlledChecked : internalChecked;

    const toggle = React.useCallback(() => {
      if (disabled) return;
      const next = !checked;
      if (!isControlled) setInternalChecked(next);
      onCheckedChange?.(next);
    }, [checked, disabled, isControlled, onCheckedChange]);

    return (
      <button
        ref={ref}
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-required={required}
        disabled={disabled}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
        className={cn(
          "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 bg-input data-[state=checked]:bg-primary",
          className
        )}
        data-state={checked ? "checked" : "unchecked"}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
        {/* 隐藏 input：用于 form 提交 */}
        {name && (
          <input
            type="checkbox"
            name={name}
            value={value}
            checked={checked}
            onChange={() => {}}
            hidden
            disabled={disabled}
            aria-hidden="true"
          />
        )}
      </button>
    );
  }
);
Switch.displayName = "Switch";

export { Switch };
