import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "/",
  credentials: "include",
  prepareHeaders: (headers, { getState }: any) => {
    const token = getState().auth.token;

    // If we have a token set in state, let's assume that we should be passing it.
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery: baseQuery,
  // tagTypes: Object.values(TagType),
  endpoints: (builder) => ({}),
});
