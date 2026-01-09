import { createApi } from "@reduxjs/toolkit/query/react";
import { getBaseQuery } from "src/modules/common/api/base";

export const gameApi = createApi({
  reducerPath: "gameApi",
  baseQuery: getBaseQuery({ baseUrl: "/games" }),
  endpoints: (build) => ({
    swapCards: build.mutation<void, { lobbyId: number }>({
      query: (body) => ({
        url: `/swap`,
        method: "POST",
        body,
        responseHandler: "text",
      }),
    }),
  }),
});

export const { useSwapCardsMutation } = gameApi;
