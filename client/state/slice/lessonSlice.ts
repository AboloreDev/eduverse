import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/authTypes";

export interface Global {
  isOpen: boolean;
}

export const initialState: Global = {
  isOpen: false,
};

export const lessonSlice = createSlice({
  name: "lesson",
  initialState,
  reducers: {
    setIsOpen: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { setIsOpen } = lessonSlice.actions;

export default lessonSlice.reducer;
