import clsx from "clsx";
import React from "react";

type ListItemProps = React.LiHTMLAttributes<HTMLLIElement> & {
  active?: boolean;
  disabled?: boolean;
  className?: string;
};

const ListItem: React.FC<ListItemProps> = ({
  active = false,
  disabled = false,
  className,
  children,
  ...props
}) => {
  return (
    <li
      className={clsx(
        "px-5 py-3 border-b-2 last:border-b-0 border-secondary cursor-pointer transition-colors duration-200",
        active && "bg-primary text-(--color-text-primary)",
        disabled && "opacity-50 cursor-not-allowed",
        !active && !disabled && "hover:bg-gray-100",
        className,
      )}
      {...props}
    >
      {children}
    </li>
  );
};

export default ListItem;
