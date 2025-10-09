import { baseQueryWithAuth } from "@/lib/baseQueryWithAuth";
import { createApi } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "../types/authTypes";
import {
  CourseDeleteResponse,
  CourseResponse,
  editCourseRequest,
} from "../types/courseTypes";
import { api } from "./baseApi";

export const courseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fetchAllCourses: builder.query<CourseResponse<object>, void>({
      query: () => "/api/v1/project/courses/all",
      providesTags: ["Courses", "User", "Chapter"],
    }),

    fetchSingleCourse: builder.query<CourseResponse<object>, string>({
      query: (id) => `/api/v1/project/courses/${id}`,
      providesTags: ["Courses", "User", "Chapter"],
    }),

    deleteSingleCourse: builder.mutation<CourseDeleteResponse, string>({
      query: (id) => ({
        url: `/api/v1/project/courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses", "User", "Chapter"],
    }),

    editCourse: builder.mutation<CourseResponse<object>, editCourseRequest>({
      query: ({ id, data }) => ({
        url: `api/v1/project/courses/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Courses", "Chapter", "User"],
    }),
  }),
});

export const {
  useDeleteSingleCourseMutation,
  useFetchAllCoursesQuery,
  useFetchSingleCourseQuery,
  useEditCourseMutation,
} = courseApi;
