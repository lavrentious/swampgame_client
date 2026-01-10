import { Card } from "src/modules/game/components/cards/types";

export type LobbyState =
  | "LS_WAITING_FOR_PLAYERS"
  | "LS_COUNTDOWN_BEFORE_START"
  | "LS_CHOOSING_CARD"
  | "LS_TRANSFERING_CARD"
  | "LS_FIRST_FOLD_PROCESSING"
  | "LS_WAITING_FOR_OTHERS_TO_FOLD"
  | "LS_OTHERS_FOLD_PROCESSING"
  | "LS_SHOWING_RESULT";

export type PlainCard = {
  value: string; // e.g. "ACE of SPADES"
};

export type Player = {
  userId: number;
  lobbyId: number;
  displayName: string;
  host: boolean;
  hand?:
    | [PlainCard | null, PlainCard | null, PlainCard | null, PlainCard | null]
    | null; // none if hidden (not current user)
  selectedCard?: Card; // none if hidden (not current user)
  position?: number | null;
  moneyEarned: number;
  moneyTaken: number;
  foldOrderNumber?: number | null;
  selectedCardIndex: number;
};

export type Lobby = {
  id: number;
  name: string;
  hostUserId: number;
  moveTimeout: number;
  capacity: number;
  isPrivate: boolean;
};

export type CachedLobby = {
  lobbyId: number;
  hostUserId: number;
  players: Player[];
  capacity: number;
  lobbyState: LobbyState;
  initGameStartTimestamp: number;
  lastMoveTimestamp: number;
  lastSwapTimestamp: number;
};

export type LobbyWithCache = { lobby: Lobby; cached: CachedLobby };

// create

export type CreateLobbyRequest = {
  name: string;

  hostUserId: number;
  capacity: number;

  isPrivate: boolean;
  password?: string;

  moveTimeout: number;
};

export type CreateLobbyResponse = {
  lobbyId: number;
  lobbyWebSocketTopic: string;
  status: string;
  lobbyAction: "LOBBY_CREATED";
};

export type JoinLobbyRequest = {
  userId: number;
  lobbyId: number;
  password?: string;
};

export type JoinLobbyResponse = {
  lobbyId: number;
  lobbyWebSocketTopic: string;
  status: string;
  LobbyAction: "PLAYER_JOINED";
};

export type LobbyWsMessage = {
  lobbyId: number;
  userId: number;
  displayName: string;
  eventType: "PLAYER_JOINED_LOBBY" | "PLAYER_LEFT_LOBBY";
  payload: string;
  timestamp: string;
};
