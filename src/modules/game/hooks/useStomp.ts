import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";

type UseStompOptions<T = unknown> = {
  url: string;
  onMessage: (msg: T) => void;
  jwt?: string;
  skip?: boolean;
  parseJson?: boolean;
};

export function useStomp<T = unknown>({
  url,
  onMessage,
  jwt,
  skip = false,
  parseJson = true,
}: UseStompOptions<T>) {
  const clientRef = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (skip) {
      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
      }
      setConnected(false);
      return;
    }

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
      setConnected(true);

      client.subscribe(url, (message) => {
        const body = message.body;

        try {
          onMessage((parseJson ? JSON.parse(body) : body) as T);
        } catch (err) {
          console.error("Failed to parse STOMP message", body);
          console.error(err);
        }
      });
    };

    client.onDisconnect = () => {
      setConnected(false);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      console.log("disconnecting...");
      client.deactivate();
      clientRef.current = null;
      setConnected(false);
    };
  }, [url, onMessage, jwt, skip, parseJson]);

  const send = (destination: string, body: unknown) => {
    if (!connected || !clientRef.current) return;

    clientRef.current.publish({
      destination,
      body: JSON.stringify(body),
    });
  };

  return { send, connected };
}
