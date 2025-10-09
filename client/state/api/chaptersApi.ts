import { baseQueryWithAuth } from "@/lib/baseQueryWithAuth";
import { createApi } from "@reduxjs/toolkit/query/react";

import {
  ReOrderChapterRequest,
  ReOrderChapterResponse,
} from "../types/chapterTypes";
import { ApiResponse } from "../types/authTypes";
import { api } from "./baseApi";

export const chaptersApi = api.injectEndpoints({
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
      invalidatesTags: ["Courses", "Chapter"],
    }),

    createChapter: builder.mutation<
      ApiResponse<object>,
      { name: string; courseId: string }
    >({
      query: (data) => ({
        url: `/api/v1/project/courses/chapters/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Courses", "Chapter"],
    }),

    deleteChapter: builder.mutation<
      ApiResponse<object>,
      { courseId: string; chapterId: string }
    >({
      query: ({ courseId, chapterId }) => ({
        url: `/api/v1/project/courses/${courseId}/chapters/${chapterId}/delete`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses", "Chapter"],
    }),
  }),
});

export const {
  useReOrderChaptersMutation,
  useCreateChapterMutation,
  useDeleteChapterMutation,
} = chaptersApi;
