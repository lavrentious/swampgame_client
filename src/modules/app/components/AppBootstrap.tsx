import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { skipToken } from "@reduxjs/toolkit/query";
import { useGetCachedLobbyQuery } from "src/modules/lobbies/api/lobbies";
import { useGlobalLobbyStomp } from "src/modules/lobbies/hooks/useGlobalLobbyStomp";
import { useAppSelector } from "src/store";
import { useGetMyStateQuery } from "../api/app";

export function AppBootstrap() {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  const { data, isSuccess } = useGetMyStateQuery(void 0, {
    skip: !isAuthenticated,
  });

  const { data: cachedLobby } = useGetCachedLobbyQuery(
    data?.status === "in_lobby" ? data.lobbyId : skipToken,
  );

  useGlobalLobbyStomp();

  useEffect(() => {
    if (!isSuccess || !data || data.status !== "in_lobby" || !cachedLobby)
      return;

    const target =
      cachedLobby.lobbyState === "LS_WAITING_FOR_PLAYERS"
        ? `/lobby/${data.lobbyId}`
        : `/game/${data.lobbyId}`;

    if (location.pathname !== target) {
      navigate(target, { replace: true });
    }
  }, [cachedLobby, data, isSuccess, navigate, location.pathname]);

  return null;
}
