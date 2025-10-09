import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/authTypes";

export interface Global {
  isOpen: boolean;
}

export const initialState: Global = {
  isOpen: false,
};

export const chapterSlice = createSlice({
  name: "chapter",
  initialState,
  reducers: {
    setIsOpen: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { setIsOpen } = chapterSlice.actions;

export default chapterSlice.reducer;
