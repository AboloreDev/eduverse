import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/authTypes";

export interface Global {
  user: User | null;
  showPassword: boolean;
  accessToken: string | null;
  filters: FiltersState;
}

export interface FiltersState {
  name: string;
  level: string[];
  priceRange: [number, number] | [null, null];
}

export const initialState: Global = {
  user: null,
  showPassword: false,
  accessToken: null,
  filters: {
    name: "",
    level: [],
    priceRange: [null, null],
  },
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
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<FiltersState>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
});

export const {
  setUser,
  clearUser,
  setShowPassword,
  setAccessToken,
  setFilters,
} = globalSlice.actions;

export default globalSlice.reducer;
