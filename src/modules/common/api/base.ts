import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import toast from "react-hot-toast";
import { authApi } from "src/modules/auth/api/auth";
import { RootState } from "src/store";
import { formatApiError } from "./utils";

export interface BaseQueryOptions {
  baseUrl: string;
}

const mutex = new Mutex();
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
    await mutex.waitForUnlock();

    let result = await rawBaseQuery(args, api, extraOptions);

    const previousJwt = result.meta?.request.headers
      .get("Authorization")
      ?.slice(7);

    if (result.error && result.error.status === 401) {
      if (!mutex.isLocked()) {
        const release = await mutex.acquire();

        const currentJwt = (api.getState() as RootState).auth.accessToken;
        console.log({ previousJwt, currentJwt });
        if (currentJwt && currentJwt !== previousJwt) {
          console.log("token changed");
          release();
          return result;
        }

        console.log("unauthorized, refreshing token...");

        try {
          const initData = (api.getState() as RootState).auth.initData;

          if (!initData) throw new Error("No init data available for re-auth");

          await api
            .dispatch(
              authApi.endpoints.telegramAuth.initiate({ data: initData }),
            )
            .unwrap();

          console.log("retrying request...");
          result = await rawBaseQuery(args, api, extraOptions);
        } catch (e) {
          toast.error(
            "Failed to refresh token: " +
              formatApiError(e as FetchBaseQueryError),
          );
        } finally {
          release();
        }
      } else {
        console.log("waiting for token refresh...");
        await mutex.waitForUnlock();
        result = await rawBaseQuery(args, api, extraOptions);
      }
    }

    return result;
  };
}
