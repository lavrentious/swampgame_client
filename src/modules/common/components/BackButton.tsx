import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Button } from "src/ui/components/Button";

type BackButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const BackButton: React.FC<BackButtonProps> = ({ ...props }) => {
  return (
    <Button variant="secondary" square size="md" {...props}>
      <FaArrowLeft />
    </Button>
  );
};

export default BackButton;
