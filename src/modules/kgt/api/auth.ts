import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../store/authSlice";

export interface TelegramAuthRequest {
  data: string;
}

export interface AuthUser {
  id: number;
  telegramId: number;
}

export interface AuthResponse {
  jwt: string;

  id: number;
  telegramId: number;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
  }),
  endpoints: (builder) => ({
    telegramAuth: builder.mutation<AuthResponse, TelegramAuthRequest>({
      query: (body) => ({
        url: "/auth/telegram",
        method: "POST",
        body,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { jwt, id, telegramId },
          } = await queryFulfilled;

          dispatch(
            setCredentials({ accessToken: jwt, user: { id, telegramId } }),
          );
        } catch {
          // ignore
        }
      },
    }),
  }),
});

export const { useTelegramAuthMutation } = authApi;
