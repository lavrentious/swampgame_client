import clsx from "clsx";
import React from "react";

type SideDrawerProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  side?: "left" | "right";
};

export const SideDrawer: React.FC<SideDrawerProps> = ({
  open,
  onClose,
  children,
  side = "left",
}) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className={clsx(
          "fixed inset-0 bg-black/50 transition-opacity z-40",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={clsx(
          "fixed top-0 h-full w-72 bg-surface-alt z-50",
          "transition-transform duration-300 ease-out",
          side === "left" ? "left-0" : "right-0",
          open
            ? "translate-x-0"
            : side === "left"
              ? "-translate-x-full"
              : "translate-x-full",
        )}
      >
        {children}
      </aside>
    </>
  );
};
