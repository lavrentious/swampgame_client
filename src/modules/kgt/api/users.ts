import { createApi } from "@reduxjs/toolkit/query/react";
import { getBaseQuery } from "src/modules/common/api/base";

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
  baseQuery: getBaseQuery({ baseUrl: "/users" }),
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
