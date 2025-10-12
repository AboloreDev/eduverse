import { baseQueryWithAuth } from "@/lib/baseQueryWithAuth";
import { createApi } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "../types/authTypes";
import {
  CourseDeleteResponse,
  CourseResponse,
  editCourseRequest,
  SingleCourse,
  SingleCourseResponse,
} from "../types/courseTypes";
import { api } from "./baseApi";

export const courseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fetchAllCourses: builder.query<CourseResponse<object>, any>({
      query: ({ page = 1, limit = 5 }) =>
        `/api/v1/project/courses/all?page=${page}&limit=${limit}`,
      providesTags: ["Courses"],
    }),

    fetchSingleCourse: builder.query<SingleCourseResponse<object>, any>({
      query: (id) => `/api/v1/project/courses/${id}`,
      providesTags: ["Courses"],
    }),

    deleteSingleCourse: builder.mutation<CourseDeleteResponse, string>({
      query: (courseId) => ({
        url: `/api/v1/project/courses/${courseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"],
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
