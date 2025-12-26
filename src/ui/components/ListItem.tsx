import clsx from "clsx";
import React from "react";
import ListContext from "./ListContext";

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
  const { flush } = React.useContext(ListContext);

  return (
    <li
      className={clsx(
        "px-5 py-3 border-b-2 last:border-b-0 border-secondary cursor-pointer transition-colors duration-200",
        active && "bg-primary text-text-primary",
        disabled && "opacity-50 cursor-not-allowed",
        !active && !disabled && "hover:bg-secondary-hover",
        !flush && "first:rounded-t-xl last:rounded-b-xl",
        className,
      )}
      {...props}
    >
      {children}
    </li>
  );
};

export default ListItem;
