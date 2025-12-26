import clsx from "clsx";
import React from "react";
import ListContext from "./ListContext";

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
    <ListContext.Provider value={{ flush }}>
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
    </ListContext.Provider>
  );
};

export default List;
