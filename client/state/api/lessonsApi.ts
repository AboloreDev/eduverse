import { baseQueryWithAuth } from "@/lib/baseQueryWithAuth";
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  ReOrderLessonsRequest,
  ReOrderLessonsResponse,
} from "../types/lessonTypes";

export const lessonsApi = createApi({
  baseQuery: baseQueryWithAuth,
  reducerPath: "lessonsApi",
  tagTypes: ["Courses"],
  endpoints: (builder) => ({
    reOrderLessons: builder.mutation<
      ReOrderLessonsResponse,
      ReOrderLessonsRequest
    >({
      query: ({ courseId, lessons, chapterId }) => ({
        url: `/api/v1/project/courses/${courseId}/chapters/${chapterId}/lessons/re-order`,
        method: "PUT",
        body: { lessons },
      }),
      invalidatesTags: ["Courses"],
    }),
  }),
});

export const { useReOrderLessonsMutation } = lessonsApi;
