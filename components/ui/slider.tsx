// components/ui/slider.tsx v1.0 — 纯 React Slider
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (values: number[]) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function Slider({
  min = 0,
  max = 100,
  step = 1,
  value: controlledValue,
  defaultValue,
  onValueChange,
  disabled,
  className,
  id,
}: SliderProps): React.ReactNode {
  const isControlled = controlledValue !== undefined;
  const [internal, setInternal] = React.useState<number[]>(defaultValue ?? [min]);
  const values = isControlled ? controlledValue : internal;
  const value = values[0] ?? min;

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = Number(e.target.value);
      if (!isControlled) setInternal([v]);
      onValueChange?.([v]);
    },
    [isControlled, onValueChange]
  );

  const pct = ((value - min) / Math.max(1, max - min)) * 100;

  return (
    <div
      id={id}
      className={cn(
        "relative flex w-full touch-none items-center select-none py-2",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      <div className="relative flex w-full items-center h-5">
        <span className="absolute left-0 right-0 h-1.5 rounded-full bg-muted" aria-hidden="true" />
        <span
          className="absolute left-0 h-1.5 rounded-full bg-primary transition-[width] duration-150"
          style={{ width: `${pct}%` }}
          aria-hidden="true"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
        />
        <span
          className="relative block h-5 w-5 shrink-0 rounded-full border border-primary bg-background shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-transform hover:scale-110"
          style={{ left: `calc(${pct}% - 0.625rem)` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
