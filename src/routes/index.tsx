import React from "react";
import NotFoundPage from "src/modules/common/pages/NotFoundPage";
import SettingsPage from "src/modules/common/pages/SettingsPage";
import CreateLobby from "src/modules/kgt/pages/CreateLobby";
import GamePage from "src/modules/kgt/pages/GamePage";
import LobbyWaitingPage from "src/modules/kgt/pages/LobbyWaitingPage";
import MainPage from "src/modules/kgt/pages/MainPage";
import ProfilePage from "src/modules/kgt/pages/ProfilePage";
import ShopPage from "src/modules/kgt/pages/ShopPage";
import TestPage from "src/modules/kgt/pages/TestPage";

export type Route = {
  path: string;
  element: React.ReactNode;
};
const routes: Route[] = [
  { element: <MainPage />, path: "/" },
  { element: <ShopPage />, path: "/shop" },
  { element: <GamePage />, path: "/game" },
  { element: <ProfilePage />, path: "/profile" },
  { element: <CreateLobby />, path: "/create-lobby" },
  { element: <LobbyWaitingPage />, path: "/lobby-waiting" },
  { element: <TestPage />, path: "/test" },
  { element: <SettingsPage />, path: "/settings" },
  { element: <NotFoundPage />, path: "/*" },
];

export default routes;
