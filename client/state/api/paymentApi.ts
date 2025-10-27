import { api } from "./baseApi";
import { PaymentResponse } from "../types/paymentTypes";

export const paymentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createStripeCustomerId: builder.mutation<PaymentResponse, string>({
      query: (courseId) => ({
        url: `/api/v1/project/payment/${courseId}`,
        method: "POST",
      }),
      invalidatesTags: ["Courses", "User", "Enrollment"],
    }),

    getEnrollmentStats: builder.query({
      query: () => "/api/v1/project/payment/dashboard-stats",
      providesTags: ["User", "Enrollment"],
    }),

    getEnrolledCourses: builder.query({
      query: () => `/api/v1/project/payment`,
      providesTags: ["User", "Enrollment"],
    }),
  }),
});

export const {
  useCreateStripeCustomerIdMutation,
  useGetEnrollmentStatsQuery,
  useGetEnrolledCoursesQuery,
} = paymentApi;
