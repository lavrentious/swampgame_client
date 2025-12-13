import React from "react";
import NotFoundPage from "src/modules/common/pages/NotFoundPage";
import SettingsPage from "src/modules/common/pages/SettingsPage";
import LobbyPage from "src/modules/kgt/pages/LobbyPage";
import MainPage from "src/modules/kgt/pages/MainPage";

export type Route = {
  path: string;
  element: React.ReactNode;
};
const routes: Route[] = [
  { element: <MainPage />, path: "/" },
  { element: <LobbyPage />, path: "/lobby" },
  { element: <SettingsPage />, path: "/settings" },
  { element: <NotFoundPage />, path: "/*" },
];

export default routes;
