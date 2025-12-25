import React from "react";
import { useNavigate } from "react-router";
import BackButton from "./BackButton";
import UserPfp from "./UserPfp";

interface HeaderProps {
  title: string;
  backPath?: string;
  showUserPfp?: boolean;
  size?: "sm" | "lg";
}

const Header: React.FC<HeaderProps> = ({
  title,
  backPath,
  showUserPfp = true,
  size = "lg",
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={`flex items-center justify-between px-4 ${size === "sm" ? "text-sm pt-3" : "text-xl py-4"}`}
    >
      <div
        className={`flex items-center gap-2 ${size === "sm" ? "gap-1" : "gap-2"}`}
      >
        {backPath && <BackButton onClick={() => navigate(backPath)} />}
        <h1 className={`font-bold ${size === "sm" ? "text-lg" : "text-2xl"}`}>
          {title}
        </h1>
      </div>
      {showUserPfp && (
        <UserPfp
          onClick={() => navigate("/profile")}
          size={size === "sm" ? 32 : undefined}
        />
      )}
    </div>
  );
};

export default Header;
