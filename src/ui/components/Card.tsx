import clsx from "clsx";
import React from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

const Card: React.FC<CardProps> & {
  Header: React.FC<CardProps>;
  Body: React.FC<CardProps>;
  Footer: React.FC<CardProps>;
} = ({ children, className, ...props }) => {
  return (
    <div
      className={clsx(
        "bg-surface-alt rounded-2xl shadow-sm border border-secondary overflow-hidden",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Header = ({ children, className, ...props }) => {
  return (
    <div
      className={clsx(
        "px-5 py-3 border-b border-secondary font-semibold",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Body = ({ children, className, ...props }) => {
  return (
    <div className={clsx("px-5 py-4", className)} {...props}>
      {children}
    </div>
  );
};

Card.Footer = ({ children, className, ...props }) => {
  return (
    <div
      className={clsx(
        "px-5 py-3 border-t border-secondary flex items-center gap-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
