import React, { useMemo } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router";
import IconButton, { IconButtonProps } from "./IconButton";

type BackButtonProps = Omit<IconButtonProps, "icon"> & {
  to?: string;
  disableDefault?: boolean;
};

const BackButton: React.FC<BackButtonProps> = ({
  to,
  disableDefault = false,
  ...props
}) => {
  const navigate = useNavigate();

  const onClick = useMemo(() => {
    if (props.onClick) {
      return props.onClick;
    }
    if (to) {
      return () => navigate(to);
    }
    if (!disableDefault) {
      return () => navigate(-1);
    }

    return () => {};
  }, [disableDefault, navigate, props.onClick, to]);

  return <IconButton {...props} onClick={onClick} icon={<FaArrowLeft />} />;
};

export default BackButton;
