import React from "react";
import NotFoundPage from "src/modules/common/pages/NotFoundPage";
import SettingsPage from "src/modules/common/pages/SettingsPage";
import TestPage from "src/modules/common/pages/TestPage";
import GamePage from "src/modules/game/pages/GamePage";
import CreateLobby from "src/modules/lobbies/pages/CreateLobby";
import MainPage from "src/modules/lobbies/pages/LobbiesListPage";
import LobbyWaitingPage from "src/modules/lobbies/pages/LobbyWaitingPage";
import ShopPage from "src/modules/shop/pages/ShopPage";
import ProfilePage from "src/modules/users/pages/ProfilePage";

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
