import clsx from "clsx";
import React from "react";

type ButtonVariant = "primary" | "secondary" | "success" | "info";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
  rounded?: boolean;
  square?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  rounded = false,
  square = false,
  fullWidth = false,
  children,
  className,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-200 focus:outline-none cursor-pointer";

  const sizeClass = {
    sm: "h-8 text-sm",
    md: "h-10 text-base",
    lg: "h-12 text-lg",
  }[size];

  const layoutClass = square ? "aspect-square px-0" : "px-5";

  const roundedClass = rounded ? "rounded-full" : "rounded-lg";

  const variantClass = {
    primary:
      "bg-[var(--color-primary)] text-[var(--color-text-primary)] hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-hover)]",
    secondary:
      "bg-[var(--color-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-secondary-hover)] active:bg-[var(--color-secondary-hover)]",
    success:
      "bg-[var(--color-status-waiting)] text-white hover:bg-[var(--color-status-waiting)/80] active:bg-[var(--color-status-waiting)/80]",
    info: "bg-[var(--color-status-playing)] text-white hover:bg-[var(--color-status-playing)/80] active:bg-[var(--color-status-playing)/80]",
  }[variant];

  const buttonClass = clsx(
    base,
    sizeClass,
    layoutClass,
    roundedClass,
    variantClass,
    fullWidth && !square && "w-full",
    className,
  );

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
};
