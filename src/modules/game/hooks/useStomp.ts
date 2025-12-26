import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";

// pass onMessage as useCallback!
export function useStomp(url: string, onMessage: (msg: object) => void) {
  const clientRef = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    console.log("connecting ws ...");
    const client = new Client({
      webSocketFactory: () => new SockJS(import.meta.env.VITE_API_WS_URL, null),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectHeaders: {
        "ngrok-skip-browser-warning": "true",
      },
    });

    client.onConnect = () => {
      setConnected(true);
      client.subscribe(url, (message) => {
        onMessage(JSON.parse(message.body));
      });
    };

    client.onDisconnect = () => setConnected(false);

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [onMessage, url]);

  const send = (destination: string, body: object) => {
    if (connected && clientRef.current) {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(body),
      });
    } else {
      console.warn("STOMP not connected yet");
    }
  };

  return { send, connected };
}
