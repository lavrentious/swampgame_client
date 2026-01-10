import { Client } from "@stomp/stompjs";
import { useCallback, useEffect, useState } from "react";
import { useStore } from "react-redux";
import SockJS from "sockjs-client";
import { RootState, useAppDispatch, useAppSelector } from "src/store";
import { LobbyWsMessage } from "../api/types";
import { handleLobbyWsMessage } from "../api/ws";

type GlobalLobbyStomp = {
  send: (destination: string, body: unknown) => void;
  connected: boolean;
};

let globalClient: Client | null = null;
const subscribers: Set<() => void> = new Set();
let connectedState = false;

export function useGlobalLobbyStomp(): GlobalLobbyStomp {
  const dispatch = useAppDispatch();
  const jwt = useAppSelector((s) => s.auth.accessToken!);
  const isAuth = useAppSelector((s) => s.auth.isAuthenticated);
  const getState = useStore().getState as () => RootState;

  const [, setRerender] = useState(0);

  const onSocketMsg = useCallback(
    (msg: LobbyWsMessage) => {
      handleLobbyWsMessage(dispatch, getState, msg);
    },
    [dispatch, getState],
  );

  // subscribe to updates from the singleton client
  useEffect(() => {
    if (!isAuth) return;

    const subscriber = () => setRerender((x) => x + 1);
    subscribers.add(subscriber);

    return () => {
      subscribers.delete(subscriber);
    };
  }, [isAuth]);

  useEffect(() => {
    if (!isAuth) {
      if (globalClient) {
        globalClient.deactivate();
        globalClient = null;
        connectedState = false;
      }
      return;
    }

    if (globalClient) return;

    console.log("connecting global lobby STOMP client...");
    const client = new Client({
      webSocketFactory: () => new SockJS(import.meta.env.VITE_API_WS_URL),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectHeaders: {
        ...(jwt ? { jwt } : {}),
      },
    });

    client.onConnect = () => {
      connectedState = true;
      subscribers.forEach((s) => s());

      client.subscribe("/topic/lobbies", (message) => {
        try {
          const body = message.body;
          onSocketMsg(JSON.parse(body));
        } catch (err) {
          console.error("Failed to parse STOMP message", message.body, err);
        }
      });
    };

    client.onDisconnect = () => {
      connectedState = false;
      subscribers.forEach((s) => s());
    };

    client.activate();
    globalClient = client;

    return () => {
      // we won't disconnect here — singleton stays alive
    };
  }, [isAuth, jwt, onSocketMsg]);

  const send = useCallback((destination: string, body: unknown) => {
    if (!globalClient || !connectedState) return;
    globalClient.publish({ destination, body: JSON.stringify(body) });
  }, []);

  return { send, connected: connectedState };
}
