import { baseQueryWithAuth } from "@/lib/baseQueryWithAuth";
import { createApi } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "../types/authTypes";
import { UploadCourseResponse } from "../types/uploadTypes";

export const fileUploadController = createApi({
  baseQuery: baseQueryWithAuth,
  reducerPath: "fileUploadController",
  tagTypes: ["Upload"],
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
      invalidatesTags: ["Upload"],
    }),

    deleteUploadFile: builder.mutation<void, string>({
      query: (key) => ({
        url: `/api/v1/project/file-uploads/${key}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Upload"],
    }),

    createCourse: builder.mutation<ApiResponse<object>, UploadCourseResponse>({
      query: (data) => ({
        url: "/api/v1/project/courses/create",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useUploadFileMutation,
  useDeleteUploadFileMutation,
  useCreateCourseMutation,
} = fileUploadController;
