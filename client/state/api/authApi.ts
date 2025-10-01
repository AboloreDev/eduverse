import { baseQueryWithAuth } from "@/lib/baseQueryWithAuth";
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  ApiResponse,
  AuthResponse,
  RefreshTokenResponse,
  User,
} from "../types/authTypes";

export const authApi = createApi({
  baseQuery: baseQueryWithAuth,
  reducerPath: "authApi",
  tagTypes: ["User", "Auth"],
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
      invalidatesTags: ["User", "Auth"],
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
      invalidatesTags: ["User", "Auth"],
    }),

    logout: builder.mutation<ApiResponse<object>, void>({
      query: () => ({
        url: "/api/v1/project/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User", "Auth"],
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
  }),
});

export const {
  useRegisterUserMutation,
  useGetUserProfileQuery,
  useLogoutMutation,
  useLoginUserMutation,
  useRefreshTokenMutation,
  useLazyGetUserProfileQuery,
} = authApi;
