import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let client: Client | null = null;
let connected = false;

type MessageCallback<T> = (msg: T) => void;

const subscriptions: Record<string, MessageCallback<any>[]> = {};

export function getStompClient() {
  if (!client) {
    client = new Client({
      webSocketFactory: () => new SockJS(import.meta.env.VITE_API_WS_URL),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      connected = true;
      console.log("STOMP connected");

      Object.entries(subscriptions).forEach(([url, callbacks]) => {
        client!.subscribe(url, (message) => {
          const body = message.body;
          callbacks.forEach((cb) => {
            try {
              cb(JSON.parse(body));
            } catch (err) {
              console.error("Failed to parse STOMP message", body);
              console.error(err);
            }
          });
        });
      });
    };

    client.onDisconnect = () => {
      connected = false;
      console.log("STOMP disconnected");
    };

    client.activate();
  }

  return client;
}

export function subscribe<T = object>(
  url: string,
  callback: MessageCallback<T>,
) {
  if (!subscriptions[url]) subscriptions[url] = [];
  subscriptions[url].push(callback);
}

export function unsubscribeAll(url: string) {
  delete subscriptions[url];
}

export function stompIsConnected() {
  return connected;
}
