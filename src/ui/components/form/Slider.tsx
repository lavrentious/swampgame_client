import clsx from "clsx";
import React from "react";

type SliderProps = {
  label?: string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">;

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  className,
  ...props
}) => {
  return (
    <div className={clsx("flex flex-col mb-4", className)}>
      {label && (
        <label className="mb-1 text-sm font-semibold text-text-secondary">
          {label}
        </label>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange?.(+e.target.value)}
        className={clsx(
          "w-full h-2 rounded-lg appearance-none cursor-pointer",
          "bg-secondary/20",
          "thumb:h-4 thumb:w-4 thumb:bg-[var(--color-primary)] thumb:rounded-full thumb:cursor-pointer thumb:shadow-md",
          "focus:outline-none focus:ring-2 focus:ring-primary",
          "accent-primary",
        )}
        {...props}
      />
    </div>
  );
};
