import React from "react";
import { Button, ButtonProps } from "./Button";
import { Spinner } from "./Spinner";

type LoadingButtonProps = {
  isLoading?: boolean;
} & ButtonProps;

const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  ...props
}) => {
  return (
    <Button {...props} disabled={props.disabled || isLoading}>
      {isLoading && <Spinner size="sm" variant="secondary" />}
      {props.children}
    </Button>
  );
};

export default LoadingButton;
