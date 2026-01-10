import { createApi } from "@reduxjs/toolkit/query/react";
import { getBaseQuery } from "src/modules/common/api/base";
import { setUserState } from "../store/appSlice";
import { UserAppState } from "../types";

export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: getBaseQuery({ baseUrl: "" }),
  endpoints: (builder) => ({
    getMyState: builder.query<UserAppState, void>({
      query: () => "/me/state",
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUserState(data));
        } catch {
          dispatch(setUserState({ status: "idle" }));
        }
      },
    }),
  }),
});

export const { useGetMyStateQuery } = appApi;
