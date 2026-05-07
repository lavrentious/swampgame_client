// SideNav.tsx
import clsx from "clsx";
import { useCallback, useMemo } from "react";
import { FaHome, FaPeopleArrows, FaUser } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import List from "src/ui/components/List";

const SideNavItem: React.FC<{
  title: string;
  url?: string;
  icon?: React.ReactNode;
  onNavigate?: () => void;
}> = ({ title, icon, url, onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = useCallback(() => {
    if (url) {
      navigate(url);
    }
    onNavigate?.();
  }, [navigate, onNavigate, url]);

  const active = useMemo(() => location.pathname === url, [location, url]);

  return (
    <div
      className={clsx(
        active && "bg-primary/50",
        "m-2 p-3 rounded-xl clickable",
      )}
      onClick={handleNavigate}
    >
      <span className="flex items-center gap-2">
        {icon}
        <span className="text-text-secondary">{title}</span>
      </span>
    </div>
  );
};

export const SideNav: React.FC<{ onNavigate?: () => void }> = ({
  onNavigate,
}) => {
  const items = [
    {
      title: "Home",
      icon: <FaHome />,
      url: "/",
    },
    // {
    //   title: "Shop",
    //   icon: <FaShoppingCart />,
    //   url: "/shop",
    // },
    {
      title: "Profile",
      icon: <FaUser />,
      url: "/profile",
    },
    {
      title: "Friends",
      icon: <FaPeopleArrows />,
      url: "/friends",
    },
  ];

  return (
    <nav className="w-full">
      <h2 className="px-5 py-3 text-sm font-semibold text-text-secondary uppercase tracking-wider">
        <img
          className="h-10 w-10 inline-block rounded-xl"
          src="https://lavrent.dog/assets/acorn_shot.png"
          alt="CryptoSwamp"
        />{" "}
        CryptoSwamp
      </h2>
      <List flush>
        {items.map((item) => (
          <SideNavItem
            key={item.title}
            title={item.title}
            icon={item.icon}
            url={item.url}
            onNavigate={onNavigate}
          />
        ))}
      </List>
    </nav>
  );
};
