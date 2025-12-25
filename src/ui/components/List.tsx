import clsx from "clsx";
import React from "react";

type ListProps = React.HTMLAttributes<HTMLUListElement> & {
  children: React.ReactNode;
  flush?: boolean;
  className?: string;
};

const List: React.FC<ListProps> = ({
  children,
  flush = false,
  className,
  ...props
}) => {
  return (
    <ul
      className={clsx(
        "bg-surface-alt rounded-2xl",
        flush && "border-none rounded-none",
        className,
      )}
      {...props}
    >
      {children}
    </ul>
  );
};

export default List;
