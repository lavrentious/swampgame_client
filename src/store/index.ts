import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { appApi } from "src/modules/app/api/app";
import appReducer from "src/modules/app/store/appSlice";
import { authApi } from "src/modules/auth/api/auth";
import authReducer from "src/modules/auth/store/authSlice";
import { gameApi } from "src/modules/game/api/game";
import { lobbiesApi } from "src/modules/lobbies/api/lobbies";
import { shopApi } from "src/modules/shop/api/shop";
import { usersApi } from "src/modules/users/api/users";

const rootReducer = combineReducers({
  auth: authReducer,
  app: appReducer,
  [lobbiesApi.reducerPath]: lobbiesApi.reducer,
  [shopApi.reducerPath]: shopApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [appApi.reducerPath]: appApi.reducer,
  [gameApi.reducerPath]: gameApi.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      lobbiesApi.middleware,
      shopApi.middleware,
      authApi.middleware,
      usersApi.middleware,
      appApi.middleware,
      gameApi.middleware,
    ),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
