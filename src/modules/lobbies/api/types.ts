import { Card } from "src/modules/game/components/cards/types";

export type LobbyState =
  | "LS_WAITING_FOR_PLAYERS"
  | "LS_GAME_IN_PROGRESS"
  | "LS_FIRST_FOLD_PROCESSED"
  | "LS_WAITING_FOR_OTHER_FOLDS"
  | "LS_SHOWING_RESULTS"
  | "LS_GAME_ENDED";

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
