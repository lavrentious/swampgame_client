import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ShopItem } from "./types";

export const shopApi = createApi({
  reducerPath: "shopApi",
  baseQuery: fetchBaseQuery({
    baseUrl: (import.meta.env.VITE_API_BASE_URL ?? "") + "/shop",
  }),
  endpoints: (build) => ({
    getShopItems: build.query<ShopItem[], void>({
      query: () => "/items/",
    }),
  }),
});

export const { useGetShopItemsQuery } = shopApi;
