import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { authApi } from "src/modules/auth/api/auth";
import authReducer from "src/modules/auth/store/authSlice";
import { lobbiesApi } from "src/modules/lobbies/api/lobbies";
import { shopApi } from "src/modules/shop/api/shop";
import { usersApi } from "src/modules/users/api/users";

const rootReducer = combineReducers({
  auth: authReducer,
  [lobbiesApi.reducerPath]: lobbiesApi.reducer,
  [shopApi.reducerPath]: shopApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      lobbiesApi.middleware,
      shopApi.middleware,
      authApi.middleware,
      usersApi.middleware,
    ),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
