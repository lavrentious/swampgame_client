// SideNav.tsx
import clsx from "clsx";
import { useCallback, useMemo } from "react";
import { FaHome, FaShoppingCart, FaUser } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import List from "src/ui/components/List";
import ListItem from "src/ui/components/ListItem";

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
    <ListItem
      className={clsx(active && "bg-primary/50")}
      onClick={handleNavigate}
    >
      <span className="flex items-center gap-2">
        {icon}
        <span className="text-text-secondary">{title}</span>
      </span>
    </ListItem>
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
    {
      title: "Shop",
      icon: <FaShoppingCart />,
      url: "/shop",
    },
    {
      title: "Profile",
      icon: <FaUser />,
      url: "/profile",
    },
  ];

  return (
    <nav className="w-full">
      <h2 className="px-5 py-3 text-sm font-semibold text-text-secondary uppercase tracking-wider">
        <img
          className="h-10 w-10 inline-block"
          src="https://lavrentious.ru/assets/acorn_shot.png"
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
