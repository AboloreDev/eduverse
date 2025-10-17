import { api } from "./baseApi";
import { PaymentResponse } from "../types/paymentTypes";

export const paymentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createStripeCustomerId: builder.mutation<PaymentResponse, string>({
      query: (courseId) => ({
        url: `/api/v1/project/courses/${courseId}/payment/`,
        method: "POST",
      }),
    }),
  }),
});

export const { useCreateStripeCustomerIdMutation } = paymentApi;
