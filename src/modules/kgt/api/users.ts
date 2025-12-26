import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type User = {
  id: number;
  telegramId: number;
  username: string;
  level: number;
  xp: number;
  balance: number;
};

export const usersApi = createApi({
  reducerPath: "users",
  baseQuery: fetchBaseQuery({
    baseUrl: (import.meta.env.VITE_API_BASE_URL ?? "") + "/users",
  }),
  endpoints: (build) => ({
    findAllUsers: build.query<User, void>({
      query: () => "/",
    }),
    findUserById: build.query<User, number>({
      query: (id) => `/${id}`,
    }),
  }),
});

export const { useFindAllUsersQuery, useFindUserByIdQuery } = usersApi;
