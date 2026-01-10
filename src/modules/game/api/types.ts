// payloads
export type PlayerChoseCardPayload = string;

export interface PlayerReceivedCardPayload {
  message: string;
  idx: number;
  card: {
    value: string;
  };
}

export interface GameStartedPayload {
  message: string;
}

export type LeaderboardEntry = {
  userId: number;
  displayName: string;
  place: number;
  moneyEarned: number;
  expEarned: number;
};

export type GameFinishedPayload = LeaderboardEntry[];

export type StringPayload = string;

export interface ErrorPayload {
  message: string;
}

// general
export enum WsEventType {
  PLAYER_CHOSE_CARD = "PLAYER_CHOSE_CARD",
  PLAYER_RECIEVED_CARD = "PLAYER_RECIEVED_CARD",
  PLAYER_FOLDED_CARDS = "PLAYER_FOLDED_CARDS",
  PLAYER_JOINED_LOBBY = "PLAYER_JOINED_LOBBY",
  PLAYER_LEFT_LOBBY = "PLAYER_LEFT_LOBBY",

  GAME_FINISHED = "GAME_FINISHED",
  GAME_STARTED = "GAME_STARTED",

  ERROR_GAME_LOBBY_NOT_FOUND = "ERROR_GAME_LOBBY_NOT_FOUND",
  ERROR_GAME_CARDS_WERE_NOT_DEALED = "ERROR_GAME_CARDS_WERE_NOT_DEALED",

  ERROR_PLAYER_NOT_FOUND_IN_LOBBY = "ERROR_PLAYER_NOT_FOUND_IN_LOBBY",
  ERROR_PLAYER_ALREADY_FOLDED = "ERROR_PLAYER_ALREADY_FOLDED",
  ERROR_PLAYER_ILLEGAL_FOLD_ATTEMPT = "ERROR_PLAYER_ILLEGAL_FOLD_ATTEMPT",
  ERROR_PLAYER_DOESNT_OWN_THIS_CARD = "ERROR_PLAYER_DOESNT_OWN_THIS_CARD",
  ERROR_PLAYER_CHOSEN_CARD_INDEX_OUT_OF_BOUNDS = "ERROR_PLAYER_CHOSEN_CARD_INDEX_OUT_OF_BOUNDS",
  ERROR_PLAYER_UNABLE_TO_CHOOSE_CARD = "ERROR_PLAYER_UNABLE_TO_CHOOSE_CARD",
}

export interface WsResponse<T> {
  eventType: WsEventType;
  payload: T;
  timestamp: string;
}

export interface WsLobbyResponse<T> extends WsResponse<T> {
  lobbyId: number;
}

export interface WsLobbyUserResponse<T> extends WsLobbyResponse<T> {
  userId: number;
}

export type WsEventPayloadMap = {
  [WsEventType.PLAYER_CHOSE_CARD]: PlayerChoseCardPayload;
  [WsEventType.PLAYER_RECIEVED_CARD]: PlayerReceivedCardPayload;
  [WsEventType.PLAYER_FOLDED_CARDS]: StringPayload;

  [WsEventType.PLAYER_JOINED_LOBBY]: { userId: number };
  [WsEventType.PLAYER_LEFT_LOBBY]: { userId: number };

  [WsEventType.GAME_STARTED]: GameStartedPayload;
  [WsEventType.GAME_FINISHED]: GameFinishedPayload;

  [WsEventType.ERROR_GAME_LOBBY_NOT_FOUND]: StringPayload;
  [WsEventType.ERROR_GAME_CARDS_WERE_NOT_DEALED]: StringPayload;
  [WsEventType.ERROR_PLAYER_NOT_FOUND_IN_LOBBY]: StringPayload;
  [WsEventType.ERROR_PLAYER_ALREADY_FOLDED]: StringPayload;
  [WsEventType.ERROR_PLAYER_ILLEGAL_FOLD_ATTEMPT]: StringPayload;
  [WsEventType.ERROR_PLAYER_DOESNT_OWN_THIS_CARD]: StringPayload;
  [WsEventType.ERROR_PLAYER_CHOSEN_CARD_INDEX_OUT_OF_BOUNDS]: StringPayload;
  [WsEventType.ERROR_PLAYER_UNABLE_TO_CHOOSE_CARD]: StringPayload;
};

export type WsMessage = {
  [K in keyof WsEventPayloadMap]: WsLobbyUserResponse<WsEventPayloadMap[K]> & {
    eventType: K;
  };
}[keyof WsEventPayloadMap];
