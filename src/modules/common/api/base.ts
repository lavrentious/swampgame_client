import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";
import { authApi } from "src/modules/kgt/api/auth";
import { setCredentials } from "src/modules/kgt/store/authSlice";
import { AppDispatch, RootState } from "src/store";
import { formatApiError } from "./utils";

// Тип для входных данных baseQuery
export interface BaseQueryOptions {
  baseUrl: string;
}

export function getBaseQuery({
  baseUrl,
}: BaseQueryOptions): BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL + baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  });

  return async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
      console.log("unauthorized, refreshing token...");

      try {
        const dispatch: AppDispatch = api.dispatch;
        const initData = (api.getState() as RootState).auth.initData;

        if (!initData) throw new Error("No init data available for re-auth");

        const authResult = await api
          .dispatch(authApi.endpoints.telegramAuth.initiate({ data: initData }))
          .unwrap();
        console.log(authResult);

        dispatch(
          setCredentials({
            accessToken: authResult.jwt,
            user: { id: authResult.id, telegramId: authResult.telegramId },
          }),
        );

        console.log("retrying request...");
        result = await rawBaseQuery(args, api, extraOptions);
      } catch (e) {
        toast.error(
          "Failed to refresh token: " +
            formatApiError(e as FetchBaseQueryError),
        );
      }
    }

    return result;
  };
}
