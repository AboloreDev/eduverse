import { baseQueryWithAuth } from "@/lib/baseQueryWithAuth";
import { createApi } from "@reduxjs/toolkit/query/react";

import {
  ReOrderChapterRequest,
  ReOrderChapterResponse,
} from "../types/chapterTypes";

export const chaptersApi = createApi({
  baseQuery: baseQueryWithAuth,
  reducerPath: "chaptersApi",
  tagTypes: ["Courses"],
  endpoints: (builder) => ({
    reOrderChapters: builder.mutation<
      ReOrderChapterResponse,
      ReOrderChapterRequest
    >({
      query: ({ courseId, chapters }) => ({
        url: `/api/v1/project/courses/${courseId}/chapters/re-order`,
        method: "PUT",
        body: { chapters },
      }),
      invalidatesTags: ["Courses"],
    }),
  }),
});

export const { useReOrderChaptersMutation } = chaptersApi;
