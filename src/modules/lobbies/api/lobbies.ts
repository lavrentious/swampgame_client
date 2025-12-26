import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Lobby } from "./types";

export const lobbiesApi = createApi({
  reducerPath: "lobbiesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: (import.meta.env.VITE_API_BASE_URL ?? "") + "/api",
  }),
  endpoints: (build) => ({
    // TODO: types
    getLobbies: build.query<Lobby[], void>({
      query: () => "/lobby",
    }),
    createLobby: build.mutation<
      void,
      { roomName: string; creatorId: string; maxPlayers: number }
    >({
      query: (body) => ({
        url: "/lobby/create",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetLobbiesQuery, useCreateLobbyMutation } = lobbiesApi;
