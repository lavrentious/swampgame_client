import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthUser } from "../api/types";

interface AuthState {
  initData: string | null;
  accessToken: string | null;
  user: AuthUser | null;
}

const initialState: AuthState = {
  initData: null,
  accessToken: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken: string; user: AuthUser }>,
    ) => {
      console.log("settings credentials:", action.payload);
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
    },
    setInitData: (state, action: PayloadAction<string>) => {
      state.initData = action.payload;
    },
  },
});

export const { setCredentials, logout, setInitData } = authSlice.actions;
export default authSlice.reducer;
