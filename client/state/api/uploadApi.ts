import { baseQueryWithAuth } from "@/lib/baseQueryWithAuth";
import { createApi } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "../types/authTypes";
import { UploadCourseResponse } from "../types/uploadTypes";
import { api } from "./baseApi";

export const fileUploadController = api.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<
      ApiResponse<object>,
      { fileName: string; fileType: string; fileSize: number; isImage: boolean }
    >({
      query: (data) => ({
        url: "/api/v1/project/file-uploads",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Courses"],
    }),

    deleteUploadFile: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (key) => ({
        url: `/api/v1/project/file-uploads`,
        method: "DELETE",
        body: { key },
      }),
      invalidatesTags: ["Courses"],
    }),

    createCourse: builder.mutation<ApiResponse<object>, UploadCourseResponse>({
      query: (data) => ({
        url: "/api/v1/project/courses/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Courses"],
    }),
  }),
});

export const {
  useUploadFileMutation,
  useDeleteUploadFileMutation,
  useCreateCourseMutation,
} = fileUploadController;
