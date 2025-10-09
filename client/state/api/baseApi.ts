import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "@/lib/baseQueryWithAuth";

export const api = createApi({
  baseQuery: baseQueryWithAuth,
  reducerPath: "api",
  tagTypes: ["Courses", "Chapter", "User", "Lesson"],
  endpoints: () => ({}),
});
