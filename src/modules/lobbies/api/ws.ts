import { AppDispatch, RootState } from "src/store";
import { lobbiesApi } from "../api/lobbies";
import { LobbyWsMessage } from "../api/types";

async function ensureLobbyInCache(
  dispatch: AppDispatch,
  getState: () => RootState,
  lobbyId: number,
) {
  const state = getState();

  // Check if lobby already exists in getLobbiesWithCache cache
  const cachedLobbyExists = lobbiesApi.endpoints.getLobbiesWithCache
    .select()(state)
    ?.data?.some((l) => l.lobby.id === lobbyId);
  if (cachedLobbyExists) return;

  // fetch lobby + cached
  const result = await dispatch(
    lobbiesApi.endpoints.getLobbyWithCache.initiate(lobbyId),
  );

  if ("data" in result && result.data) {
    dispatch(
      lobbiesApi.util.updateQueryData(
        "getLobbiesWithCache",
        undefined,
        (draft) => {
          if (!draft.some((l) => l.lobby.id === lobbyId)) {
            draft.push(result.data!);
          }
        },
      ),
    );
  }
}

export async function handleLobbyWsMessage(
  dispatch: AppDispatch,
  getState: () => RootState,
  msg: LobbyWsMessage,
) {
  switch (msg.eventType) {
    case "PLAYER_JOINED_LOBBY": {
      await ensureLobbyInCache(dispatch, getState, msg.lobbyId);

      dispatch(
        lobbiesApi.util.updateQueryData(
          "getLobbiesWithCache",
          undefined,
          (draft) => {
            const lobbyEntry = draft.find((l) => l.lobby.id === msg.lobbyId);
            if (!lobbyEntry) return;

            if (
              !lobbyEntry.cached.players.some((p) => p.userId === msg.userId)
            ) {
              lobbyEntry.cached.players.push({
                userId: msg.userId,
                lobbyId: msg.lobbyId,
                displayName: msg.displayName,
                host: false,
                moneyEarned: 0,
                moneyTaken: 0,
                selectedCardIndex: -1,
              });
            }
          },
        ),
      );

      dispatch(
        lobbiesApi.util.updateQueryData(
          "getCachedLobby",
          msg.lobbyId,
          (draft) => {
            if (!draft.players.some((p) => p.userId === msg.userId)) {
              draft.players.push({
                userId: msg.userId,
                lobbyId: msg.lobbyId,
                displayName: msg.displayName,
                host: false,
                moneyEarned: 0,
                moneyTaken: 0,
                selectedCardIndex: -1,
              });
            }
          },
        ),
      );
      break;
    }

    case "PLAYER_LEFT_LOBBY": {
      dispatch(
        lobbiesApi.util.updateQueryData(
          "getLobbiesWithCache",
          undefined,
          (draft) => {
            const lobbyEntry = draft.find((l) => l.lobby.id === msg.lobbyId);
            if (!lobbyEntry) return;

            // Remove the player
            lobbyEntry.cached.players = lobbyEntry.cached.players.filter(
              (p) => p.userId !== msg.userId,
            );

            // If lobby empty, remove it
            if (lobbyEntry.cached.players.length === 0) {
              const index = draft.findIndex((l) => l.lobby.id === msg.lobbyId);
              if (index >= 0) draft.splice(index, 1);
            }
          },
        ),
      );

      dispatch(
        lobbiesApi.util.updateQueryData(
          "getCachedLobby",
          msg.lobbyId,
          (draft) => {
            // Remove the player
            draft.players = draft.players.filter(
              (p) => p.userId !== msg.userId,
            );
          },
        ),
      );
      break;
    }
  }
}
