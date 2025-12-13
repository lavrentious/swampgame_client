import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Room } from "./types";

export const kgtApi = createApi({
  reducerPath: "kgtApi",
  baseQuery: fetchBaseQuery({
    baseUrl: (import.meta.env.VITE_API_BASE_URL ?? "") + "/api",
  }),
  endpoints: (build) => ({
    // TODO: types
    getRooms: build.query<Room[], void>({
      query: () => "/lobby",
    }),
    createRoom: build.mutation<
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

export const { useGetRoomsQuery, useLazyGetRoomsQuery, useCreateRoomMutation } =
  kgtApi;
