import clsx from "clsx";
import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const PageLayout: React.FC<Props> & {
  Header: React.FC<Props>;
  Body: React.FC<Props>;
  Footer: React.FC<Props>;
} = ({ children, className }) => {
  return (
    <div className={clsx("h-screen flex flex-col", className)}>{children}</div>
  );
};

PageLayout.Header = ({ children, className }) => {
  return <header className={clsx("shrink-0", className)}>{children}</header>;
};

PageLayout.Body = ({ children, className }) => {
  return (
    <main className={clsx("flex-1 overflow-y-auto", className)}>
      {children}
    </main>
  );
};

PageLayout.Footer = ({ children, className }) => {
  return <footer className={clsx("shrink-0", className)}>{children}</footer>;
};

export default PageLayout;
