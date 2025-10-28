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
import { url } from "inspector";

export const courseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fetchAllCourses: builder.query<CourseResponse<object>, any>({
      query: ({ search, page = 1, limit = 5 }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        if (search && search.trim() !== "") {
          params.append("search", search);
        }
        return `/api/v1/project/courses/all?${params.toString()}`;
      },
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

    fetchRecentCourses: builder.query<ApiResponse<object>, SingleCourse>({
      query: () => `/api/v1/project/courses/recent`,
      providesTags: ["Courses"],
    }),

    fetchUserEnrolledCourseDetails: builder.query<
      SingleCourseResponse<object>,
      any
    >({
      query: (id) => `/api/v1/project/courses/${id}/enrolled`,
      providesTags: ["Courses"],
    }),
  }),
});

export const {
  useDeleteSingleCourseMutation,
  useFetchAllCoursesQuery,
  useFetchSingleCourseQuery,
  useEditCourseMutation,
  useFetchRecentCoursesQuery,
  useFetchUserEnrolledCourseDetailsQuery,
} = courseApi;
