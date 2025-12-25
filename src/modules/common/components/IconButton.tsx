import React from "react";
import { Button, ButtonProps } from "src/ui/components/Button";

export type IconButtonProps = {
  icon: React.ReactNode;
} & ButtonProps;

const IconButton: React.FC<IconButtonProps> = ({ icon, ...props }) => {
  return (
    <Button variant="secondary" size="md" {...props} square>
      {icon}
    </Button>
  );
};

export default IconButton;
