import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserAppState } from "../types";

type AppSliceState = {
  initialized: boolean;
  userState: UserAppState | null;
};

const initialState: AppSliceState = {
  initialized: false,
  userState: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setUserState(state, action: PayloadAction<UserAppState>) {
      state.userState = action.payload;
      state.initialized = true;
    },
    resetAppState() {
      return initialState;
    },
  },
});

export const { setUserState, resetAppState } = appSlice.actions;
export default appSlice.reducer;
