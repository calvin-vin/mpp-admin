import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery";

export interface PaginationMeta {
  total: number;
  perPage: number;
  currentPage: number;
  totalPages: number;
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery(),
  tagTypes: [
    "DashboardMetrics",
    "Agencies",
    "Users",
    "Expenses",
    "Queues",
    "Services",
    "Institutions",
    "Regulation",
    "Setting",
    "Facilities",
  ],
  endpoints: (builder) => ({}),
});
