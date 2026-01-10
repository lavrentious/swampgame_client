import React from "react";
import { HiSignal, HiSignalSlash } from "react-icons/hi2";

interface ConnectionIconProps {
  connected: boolean;
}

const ConnectionIcon: React.FC<ConnectionIconProps> = ({ connected }) => {
  if (connected) {
    return <HiSignal className="text-green-500" />;
  }
  return <HiSignalSlash className="text-red-500" />;
};

export default ConnectionIcon;
