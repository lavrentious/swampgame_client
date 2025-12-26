import { createApi } from "@reduxjs/toolkit/query/react";
import { getBaseQuery } from "src/modules/common/api/base";
import { ShopItem } from "./types";

export const shopApi = createApi({
  reducerPath: "shopApi",
  baseQuery: getBaseQuery({ baseUrl: "/shop" }),
  endpoints: (build) => ({
    getShopItems: build.query<ShopItem[], void>({
      query: () => "/items/",
    }),
  }),
});

export const { useGetShopItemsQuery } = shopApi;
