import { createApi } from "@reduxjs/toolkit/query/react";
import { getBaseQuery } from "src/modules/common/api/base";
import {
  CachedLobby,
  CreateLobbyRequest,
  CreateLobbyResponse,
  JoinLobbyRequest,
  JoinLobbyResponse,
  Lobby,
  LobbyWithCache,
} from "./types";

export const lobbiesApi = createApi({
  reducerPath: "lobbiesApi",
  baseQuery: getBaseQuery({ baseUrl: "/lobbies" }),
  tagTypes: ["Lobby", "CachedLobby", "LobbyList"],

  endpoints: (build) => ({
    // fetch plain lobby list
    getLobbies: build.query<Lobby[], void>({
      query: () => "/",
      providesTags: (result) =>
        result
          ? [
              { type: "LobbyList", id: "LIST" },
              ...result.map((l) => ({ type: "Lobby" as const, id: l.id })),
            ]
          : [{ type: "LobbyList", id: "LIST" }],
    }),

    // fetch single lobby
    getLobby: build.query<Lobby, number>({
      query: (id) => `/${id}`,
      providesTags: (_, __, id) => [{ type: "Lobby", id }],
    }),

    // fetch cached lobby
    getCachedLobby: build.query<CachedLobby, number>({
      query: (id) => `/cache/${id}`,
      providesTags: (_, __, id) => [{ type: "CachedLobby", id }],
    }),

    // fetch lobby + cached
    getLobbyWithCache: build.query<LobbyWithCache, number>({
      async queryFn(lobbyId, _queryApi, _extraOptions, baseQuery) {
        const lobbyRes = await baseQuery(`/${lobbyId}`);
        if (lobbyRes.error) return { error: lobbyRes.error };

        const cachedRes = await baseQuery(`/cache/${lobbyId}`);
        if (cachedRes.error) return { error: cachedRes.error };

        return {
          data: {
            lobby: lobbyRes.data as Lobby,
            cached: cachedRes.data as CachedLobby,
          },
        };
      },
      providesTags: (_, __, id) => [
        { type: "Lobby", id },
        { type: "CachedLobby", id },
      ],
    }),

    // fetch all lobbies + cached
    getLobbiesWithCache: build.query<LobbyWithCache[], void>({
      async queryFn(_, _queryApi, _extraOptions, baseQuery) {
        try {
          // fetch plain lobbies
          const lobbyListRes = await baseQuery(`/`);
          if (lobbyListRes.error) return { error: lobbyListRes.error };

          const lobbies = lobbyListRes.data as Lobby[];

          // fetch cached lobbies in parallel
          const cachedResults = await Promise.all(
            lobbies.map(async (lobby) => {
              try {
                const cachedRes = await baseQuery(`/cache/${lobby.id}`);
                return cachedRes.error
                  ? null // treat as offline / deleted
                  : { lobby, cached: cachedRes.data as CachedLobby };
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
              } catch (err) {
                return null;
              }
            }),
          );

          const filtered = cachedResults.filter(
            (l) => l !== null,
          ) as LobbyWithCache[];

          return { data: filtered };
        } catch (err) {
          return {
            error: { status: "CUSTOM_ERROR", data: err, error: String(err) },
          };
        }
      },
      providesTags: (result) =>
        result
          ? [
              { type: "LobbyList", id: "LIST" },
              ...result
                .map((l) => [
                  { type: "Lobby" as const, id: l.lobby.id },
                  { type: "CachedLobby" as const, id: l.lobby.id },
                ])
                .flat(),
            ]
          : [{ type: "LobbyList", id: "LIST" }],
    }),

    createLobby: build.mutation<CreateLobbyResponse, CreateLobbyRequest>({
      query: (body) => ({
        url: "/create",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "LobbyList", id: "LIST" }],
    }),

    joinLobby: build.mutation<JoinLobbyResponse, JoinLobbyRequest>({
      query: (body) => ({
        url: "/join",
        method: "POST",
        body,
      }),
    }),

    leaveLobby: build.mutation<string, Omit<JoinLobbyRequest, "password">>({
      query: (body) => ({
        url: "/leave",
        method: "POST",
        body,
        responseHandler: "text",
      }),
    }),

    startLobby: build.mutation<string, { hostUserId: number; lobbyId: number }>(
      {
        query: (body) => ({
          url: "/start",
          method: "POST",
          body,
        }),
      },
    ),
  }),
});

export const {
  useGetLobbiesQuery,
  useGetLobbyQuery,
  useGetCachedLobbyQuery,
  useGetLobbyWithCacheQuery,
  useGetLobbiesWithCacheQuery,
  useCreateLobbyMutation,
  useJoinLobbyMutation,
  useLeaveLobbyMutation,
  useStartLobbyMutation,
} = lobbiesApi;
