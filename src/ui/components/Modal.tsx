import clsx from "clsx";
import React, { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  className?: string;
  children: ReactNode;
}

interface ModalSubProps {
  children: ReactNode;
  className?: string;
}

// Root Modal
const Modal: React.FC<ModalProps> & {
  Header: React.FC<ModalSubProps>;
  Body: React.FC<ModalSubProps>;
  Footer: React.FC<ModalSubProps>;
} = ({ open, onClose, children, className }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className={clsx(
          "bg-surface-alt rounded-xl p-6 w-full max-w-md flex flex-col gap-4",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

Modal.Header = ({ children, className }) => (
  <div className={clsx("text-lg font-semibold", className)}>{children}</div>
);

Modal.Body = ({ children, className }) => (
  <div className={clsx("flex-1", className)}>{children}</div>
);

Modal.Footer = ({ children, className }) => (
  <div className={clsx("flex justify-end gap-2 mt-2", className)}>
    {children}
  </div>
);

export default Modal;
