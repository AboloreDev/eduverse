import { baseQueryWithAuth } from "@/lib/baseQueryWithAuth";
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  ApiResponse,
  AuthResponse,
  RefreshTokenResponse,
  User,
} from "../types/authTypes";
import { api } from "./baseApi";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation<
      AuthResponse,
      { firstName: string; lastName: string; email: string; password: string }
    >({
      query: (data) => ({
        url: "/api/v1/project/auth/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    loginUser: builder.mutation<
      AuthResponse,
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/api/v1/project/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),

    logout: builder.mutation<ApiResponse<object>, void>({
      query: () => ({
        url: "/api/v1/project/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    refreshToken: builder.mutation<RefreshTokenResponse, void>({
      query: () => ({
        url: "/api/v1/project/auth/refresh",
        method: "GET",
      }),
      invalidatesTags: ["User"],
    }),

    getUserProfile: builder.query<User, void>({
      query: () => "/api/v1/project/user",
      providesTags: ["User"],
    }),
    getDashboardStats: builder.query({
      query: () => "/api/v1/project/user/dashboard-stats",
      providesTags: ["User", "Courses", "Lesson", "Chapter", "Enrollment"],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useGetUserProfileQuery,
  useLogoutMutation,
  useLoginUserMutation,
  useRefreshTokenMutation,
  useLazyGetUserProfileQuery,
  useGetDashboardStatsQuery,
} = authApi;
