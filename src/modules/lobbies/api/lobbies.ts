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
  endpoints: (build) => ({
    // TODO: types
    getLobbies: build.query<Lobby[], void>({
      query: () => "/",
    }),
    createLobby: build.mutation<CreateLobbyResponse, CreateLobbyRequest>({
      query: (body) => ({
        url: "/create",
        method: "POST",
        body,
      }),
    }),
    getLobby: build.query<Lobby, number>({
      query: (id) => `/${id}`,
    }),
    // used to retrieve lobby's state - retrieves cached lobby from hazel
    getCachedLobby: build.query<CachedLobby, number>({
      query: (id) => `/cache/${id}`,
    }),
    getLobbyWithCache: build.query<LobbyWithCache, number>({
      async queryFn(lobbyId, _queryApi, _extraOptions, baseQuery) {
        try {
          const lobbyRes = await baseQuery(`/${lobbyId}`);
          if (lobbyRes.error) return { error: lobbyRes.error };

          const cachedRes = await baseQuery(`/cache/${lobbyId}`);
          if (cachedRes.error) return { error: cachedRes.error };

          const merged: LobbyWithCache = {
            ...(lobbyRes.data as Lobby),
            cached: cachedRes.data as CachedLobby,
          };

          return { data: merged };
        } catch (err) {
          return {
            error: { status: "CUSTOM_ERROR", data: err, error: String(err) },
          };
        }
      },
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
  useCreateLobbyMutation,
  useGetCachedLobbyQuery,
  useJoinLobbyMutation,
  useLeaveLobbyMutation,
  useStartLobbyMutation,
} = lobbiesApi;
