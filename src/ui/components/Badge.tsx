import clsx from "clsx";
import React from "react";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  colorClass?: string;
  rounded?: boolean;
  children: React.ReactNode;
};

export const Badge: React.FC<BadgeProps> = ({
  colorClass = "bg-gray-200 text-black",
  rounded = false,
  children,
  className,
  ...props
}) => {
  const badgeClass = clsx(
    "px-2 py-1 text-xs font-semibold inline-block",
    rounded ? "rounded-full" : "rounded",
    colorClass,
    className,
  );

  return (
    <span className={badgeClass} {...props}>
      {children}
    </span>
  );
};
