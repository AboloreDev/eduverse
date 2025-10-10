import { baseQueryWithAuth } from "@/lib/baseQueryWithAuth";
import { Api, createApi } from "@reduxjs/toolkit/query/react";
import {
  ReOrderLessonsRequest,
  ReOrderLessonsResponse,
  SingleLessonResponse,
  UpdateLessonParams,
} from "../types/lessonTypes";
import { api } from "./baseApi";
import { ApiResponse } from "../types/authTypes";

export const lessonsApi = api.injectEndpoints({
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
      invalidatesTags: ["Courses", "Chapter", "Lesson"],
    }),
    createLesson: builder.mutation<
      ApiResponse<object>,
      {
        name: string;
        chapterId: string;
        description?: string;
        videoKey?: string;
        thumbnailKey?: string;
      }
    >({
      query: (data) => ({
        url: `/api/v1/project/courses/chapters/lessons/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Courses", "Chapter", "Lesson"],
    }),

    deleteLesson: builder.mutation<
      ApiResponse<object>,
      { chapterId: string; lessonId: string }
    >({
      query: ({ chapterId, lessonId }) => ({
        url: `/api/v1/project/courses/chapters/${chapterId}/lessons/${lessonId}/delete`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses", "Chapter", "Lesson"],
    }),

    fetchSingleLesson: builder.query<
      SingleLessonResponse<object>,
      { courseId: string; chapterId: string; lessonId: string }
    >({
      query: ({ courseId, chapterId, lessonId }) =>
        `/api/v1/project/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/`,
      providesTags: ["Courses", "Chapter", "Lesson"],
    }),
    updateLesson: builder.mutation<ApiResponse<object>, UpdateLessonParams>({
      query: ({ courseId, lessonId, chapterId, data }) => ({
        url: `/api/v1/project/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Courses", "Chapter", "Lesson"],
    }),
  }),
});

export const {
  useReOrderLessonsMutation,
  useCreateLessonMutation,
  useDeleteLessonMutation,
  useFetchSingleLessonQuery,
  useUpdateLessonMutation,
} = lessonsApi;
