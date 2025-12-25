import clsx from "clsx";
import React from "react";

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  className,
  ...props
}) => {
  return (
    <label className={clsx("flex items-center gap-2 mb-4", className)}>
      <input
        type="checkbox"
        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
        {...props}
      />
      {label && <span className="text-text-secondary">{label}</span>}
    </label>
  );
};
