import { baseQueryWithAuth } from "@/lib/baseQueryWithAuth";
import { createApi } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "../types/authTypes";
import {
  CourseDeleteResponse,
  CourseResponse,
  editCourseRequest,
} from "../types/courseTypes";
import { UploadCourseResponse } from "../types/uploadTypes";

export const courseApi = createApi({
  baseQuery: baseQueryWithAuth,
  reducerPath: "courseApi",
  tagTypes: ["Courses", "User"],
  endpoints: (builder) => ({
    fetchAllCourses: builder.query<CourseResponse<object>, void>({
      query: () => "/api/v1/project/courses/all",
      providesTags: ["Courses", "User"],
    }),

    fetchSingleCourse: builder.query<CourseResponse<object>, string>({
      query: (id) => `/api/v1/project/courses/${id}`,
      providesTags: ["Courses", "User"],
    }),

    deleteSingleCourse: builder.mutation<CourseDeleteResponse, string>({
      query: (id) => ({
        url: `/api/v1/project/courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses", "User"],
    }),

    editCourse: builder.mutation<CourseResponse<object>, editCourseRequest>({
      query: ({ id, data }) => ({
        url: `api/v1/project/courses/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Courses"],
    }),
  }),
});

export const {
  useDeleteSingleCourseMutation,
  useFetchAllCoursesQuery,
  useFetchSingleCourseQuery,
  useEditCourseMutation,
} = courseApi;
