export type UserAppState =
  | { status: "idle" }
  | { status: "in_lobby"; lobbyId: number };
