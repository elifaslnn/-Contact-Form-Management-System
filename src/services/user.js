import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const login = createApi({
  reducerPath: "login",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5165/api/user",
  }),
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),

    checUserLogin: builder.mutation({
      query: (token) => ({
        url: "/check-login",
        method: "POST",
        headers: {
          token: token,
        },
      }),
    }),
  }),
});

export const { useLoginUserMutation, useChecUserLoginMutation } = login;
