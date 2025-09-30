import { baseQueryWithAuth } from "@/lib/baseQueryWithAuth";
import { createApi } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "../types/authTypes";

export const courseApi = createApi({
  baseQuery: baseQueryWithAuth,
  reducerPath: "courseApi",
  tagTypes: ["Courses", "User"],
  endpoints: (builder) => ({
    fetchAllCourses: builder.query<ApiResponse<object>, void>({
      query: () => "/api/v1/project/courses/all",
      providesTags: ["Courses", "User"],
    }),

    fetchSingleCourse: builder.query<ApiResponse<object>, string>({
      query: (id) => `/api/v1/project/courses/${id}`,
      providesTags: ["Courses", "User"],
    }),

    deleteSingleCourse: builder.mutation<void, void>({
      query: (id) => `/api/v1/project/courses/${id}`,
      invalidatesTags: ["Courses", "User"],
    }),
  }),
});

export const {
  useDeleteSingleCourseMutation,
  useFetchAllCoursesQuery,
  useFetchSingleCourseQuery,
} = courseApi;
