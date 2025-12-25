import clsx from "clsx";
import React from "react";

type SpinnerSize = "xs" | "sm" | "md" | "lg";
type SpinnerVariant = "primary" | "secondary" | "light" | "dark";

type SpinnerProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  label?: string;
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  variant = "primary",
  label,
  className,
  ...props
}) => {
  const sizeClass = {
    xs: "w-3 h-3 border-2",
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-[3px]",
    lg: "w-10 h-10 border-4",
  }[size];

  const variantClass = {
    primary: "border-[var(--color-primary)] border-t-transparent",
    secondary: "border-secondary border-t-transparent",
    light: "border-white border-t-transparent",
    dark: "border-black border-t-transparent",
  }[variant];

  return (
    <div
      role="status"
      aria-live="polite"
      className={clsx("inline-flex items-center gap-2", className)}
      {...props}
    >
      <div
        className={clsx("animate-spin rounded-full", sizeClass, variantClass)}
      />

      {label && <span className="text-sm text-white/70">{label}</span>}
    </div>
  );
};
