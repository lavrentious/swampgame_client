import clsx from "clsx";
import React from "react";

type ProgressBarSize = "sm" | "md" | "lg";
type ProgressBarVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";

type ProgressBarProps = React.HTMLAttributes<HTMLDivElement> & {
  progress: number; // 0 to 100
  size?: ProgressBarSize;
  variant?: ProgressBarVariant;
  showLabel?: boolean; // show percentage text
  label?: string; // optional custom label
  animated?: boolean; // smooth transition
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  size = "md",
  variant = "primary",
  showLabel = true,
  label,
  animated = true,
  className,
  ...props
}) => {
  const sizeClass = {
    sm: "h-2",
    md: "h-4",
    lg: "h-6",
  }[size];

  const variantClass = {
    primary: "bg-[var(--color-primary)]",
    secondary: "bg-secondary",
    success: "bg-green-500",
    warning: "bg-yellow-400",
    danger: "bg-red-500",
  }[variant];

  return (
    <div
      className={clsx(
        "w-full bg-gray-700 rounded-full overflow-hidden",
        sizeClass,
        className,
      )}
      {...props}
    >
      <div
        className={clsx(
          "h-full rounded-full",
          variantClass,
          animated && "transition-all duration-300 ease-out",
        )}
        style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
      />
      {showLabel && (
        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white pointer-events-none">
          {label || `${Math.round(Math.min(Math.max(progress, 0), 100))}%`}
        </span>
      )}
    </div>
  );
};
