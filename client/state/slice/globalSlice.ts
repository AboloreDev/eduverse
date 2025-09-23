import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/authTypes";

export interface Global {
  user: User | null;
  showPassword: boolean;
}

export const initialState: Global = {
  user: null,
  showPassword: false,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    setShowPassword: (state) => {
      state.showPassword = !state.showPassword;
    },
  },
});

export const { setUser, clearUser, setShowPassword } = globalSlice.actions;

export default globalSlice.reducer;
