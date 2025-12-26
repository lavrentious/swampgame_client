import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { decodeJwtPayload } from "src/modules/common/api/utils";
import { setCredentials } from "../store/authSlice";

export interface TelegramAuthRequest {
  data: string;
}

export interface AuthUser {
  id: number;
  telegramId: number;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
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
        responseHandler: "text",
      }),

      transformResponse: (jwt: string): AuthResponse => {
        // FIXME: remove this jwt decoding
        const payload = decodeJwtPayload<{
          id: number;
          telegramUser: { id: number };
        }>(jwt);

        const id = payload.id as number;
        const telegramId = payload.telegramUser.id as number;

        return {
          accessToken: jwt,
          user: { id, telegramId },
        };
      },

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(setCredentials(data));
        } catch {
          // ignore
        }
      },
    }),
  }),
});

export const { useTelegramAuthMutation } = authApi;
