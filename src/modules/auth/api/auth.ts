import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../store/authSlice";
import { AuthResponse, TelegramAuthRequest } from "./types";

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
            data: { jwt, userId, telegramId },
          } = await queryFulfilled;

          console.log("auth ok", { jwt, userId, telegramId });

          dispatch(
            setCredentials({ accessToken: jwt, user: { userId, telegramId } }),
          );
        } catch {
          // ignore
        }
      },
    }),
  }),
});

export const { useTelegramAuthMutation } = authApi;
