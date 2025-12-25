import React from "react";

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={`container px-3 mx-auto ${className || ""}`} {...props}>
      {children}
    </div>
  );
};
