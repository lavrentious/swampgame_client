import { createApi } from "@reduxjs/toolkit/query/react";
import { getBaseQuery } from "src/modules/common/api/base";
import {
  Friendship,
  FriendshipRequest,
  FriendshipResponse,
  User,
} from "./types";

export const usersApi = createApi({
  reducerPath: "users",
  baseQuery: getBaseQuery({ baseUrl: "/users" }),

  tagTypes: ["User", "Friendship"],

  endpoints: (build) => ({
    // -------------------- Users --------------------
    findAllUsers: build.query<User[], void>({
      query: () => "/",
      providesTags: ["User"],
    }),

    findUserById: build.query<User, number>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),

    // -------------------- Friendships --------------------
    getAllFriendships: build.query<Friendship[], number>({
      query: (userId) => `/friendships/${userId}`,
      providesTags: (_result, _error, userId) => [
        { type: "Friendship", id: "LIST" },
        { type: "Friendship", id: userId },
      ],
    }),

    getAllFriends: build.query<Friendship[], number>({
      query: (userId) => `/friendships/friends/${userId}`,
      providesTags: (_result, _error, userId) => [
        { type: "Friendship", id: "LIST" },
        { type: "Friendship", id: userId },
      ],
    }),

    getIncomingFriendRequests: build.query<Friendship[], number>({
      query: (userId) => `/friendships/requests/incoming/${userId}`,
      providesTags: (_result, _error, userId) => [
        { type: "Friendship", id: "LIST" },
        { type: "Friendship", id: userId },
      ],
    }),

    getOutgoingFriendRequests: build.query<Friendship[], number>({
      query: (userId) => `/friendships/requests/outcoming/${userId}`,
      providesTags: (_result, _error, userId) => [
        { type: "Friendship", id: "LIST" },
        { type: "Friendship", id: userId },
      ],
    }),

    // -------------------- Mutations --------------------
    offerFriendship: build.mutation<FriendshipResponse, FriendshipRequest>({
      query: (body) => ({
        url: "/friendships",
        method: "POST",
        body,
      }),
      invalidatesTags: (
        _result,
        _error,
        { requesterUserId, addresseeUserId },
      ) => [
        { type: "Friendship", id: "LIST" },
        { type: "Friendship", id: requesterUserId },
        { type: "Friendship", id: addresseeUserId },
      ],
    }),

    acceptFriendship: build.mutation<FriendshipResponse, FriendshipRequest>({
      query: (body) => ({
        url: "/friendships/accept",
        method: "PATCH",
        body,
      }),
      invalidatesTags: (
        _result,
        _error,
        { requesterUserId, addresseeUserId },
      ) => [
        { type: "Friendship", id: "LIST" },
        { type: "Friendship", id: requesterUserId },
        { type: "Friendship", id: addresseeUserId },
      ],
    }),

    deleteFriendship: build.mutation<FriendshipResponse, FriendshipRequest>({
      query: (body) => ({
        url: "/friendships",
        method: "DELETE",
        body,
      }),
      invalidatesTags: (
        _result,
        _error,
        { requesterUserId, addresseeUserId },
      ) => [
        { type: "Friendship", id: "LIST" },
        { type: "Friendship", id: requesterUserId },
        { type: "Friendship", id: addresseeUserId },
      ],
    }),

    areFriends: build.query<boolean, { user1: number; user2: number }>({
      query: ({ user1, user2 }) => ({
        url: "/friendships/are-friends",
        params: { user1, user2 },
      }),
      providesTags: (_result, _error, { user1, user2 }) => [
        { type: "Friendship", id: user1 },
        { type: "Friendship", id: user2 },
      ],
    }),
  }),
});

export const {
  useFindAllUsersQuery,
  useFindUserByIdQuery,
  useGetAllFriendshipsQuery,
  useGetAllFriendsQuery,
  useGetIncomingFriendRequestsQuery,
  useGetOutgoingFriendRequestsQuery,
  useOfferFriendshipMutation,
  useAcceptFriendshipMutation,
  useDeleteFriendshipMutation,
  useAreFriendsQuery,
} = usersApi;
