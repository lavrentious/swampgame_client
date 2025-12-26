import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { kgtApi } from "src/modules/kgt/api";
import { authApi } from "src/modules/kgt/api/auth";
import { shopApi } from "src/modules/kgt/api/shop";
import authReducer from "src/modules/kgt/store/authSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  [kgtApi.reducerPath]: kgtApi.reducer,
  [shopApi.reducerPath]: shopApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      kgtApi.middleware,
      shopApi.middleware,
      authApi.middleware,
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
