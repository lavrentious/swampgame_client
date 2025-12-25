import clsx from "clsx";
import React from "react";

type InputProps = {
  label?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input: React.FC<InputProps> = ({
  label,
  error,
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
        className={clsx(
          "px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
          error && "border-red-500",
        )}
        {...props}
      />
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
};
