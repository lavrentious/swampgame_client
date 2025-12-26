import React from "react";
import { FiMenu } from "react-icons/fi";
import { useNavigate } from "react-router";
import { Button } from "src/ui/components/Button";
import BackButton from "./BackButton";
import UserPfp from "./UserPfp";

interface HeaderProps {
  title: string;
  backPath?: string;

  showUserPfp?: boolean;
  showBackButton?: boolean;

  /** Shows hamburger button */
  showMenuButton?: boolean;
  onMenuClick?: () => void;

  size?: "sm" | "lg";

  /** Optional custom content */
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  backPath,
  showUserPfp = true,
  showBackButton = false,
  showMenuButton = false,
  onMenuClick,
  size = "lg",
  leftSlot,
  rightSlot,
}) => {
  const navigate = useNavigate();

  const shouldShowMenu = showMenuButton && onMenuClick;

  return (
    <header
      className={`flex items-center justify-between px-4 ${
        size === "sm" ? "pt-3 text-sm" : "py-4 text-xl"
      }`}
    >
      {/* Left */}
      <div className="flex items-center gap-2">
        {shouldShowMenu && (
          <Button
            square
            variant="secondary"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <FiMenu />
          </Button>
        )}

        {showBackButton && <BackButton to={backPath} />}

        {leftSlot}

        <h1 className={`font-bold ${size === "sm" ? "text-lg" : "text-2xl"}`}>
          {title}
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {rightSlot}

        {showUserPfp && (
          <UserPfp
            onClick={() => navigate("/profile")}
            size={size === "sm" ? 32 : undefined}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
