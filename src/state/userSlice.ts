import { format } from "date-fns";
import type { PaginationMeta } from "./apiSlice";
import { apiSlice } from "./apiSlice";

// Gunakan tipe yang lebih ketat dan deskriptif
export interface User {
  id: number;
  nip: string;
  nama_lengkap: string;
  email: string;
  mobile: number;
  status: string;
  role_name: string;
}

export interface UserApiResponse {
  status: string;
  message: string;
  data: User[];
  page: {
    total: number;
    per_page: number;
    current_page: number;
    total_page: number;
  };
}

// Interface untuk parameter query
interface GetUsersParams {
  search?: string;
  page?: number;
  perPage?: number;
}

export const userSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<
      { users: User[]; pagination: PaginationMeta },
      GetUsersParams
    >({
      query: (params = {}) => ({
        url: "/users/list",
        params: {
          keyword: params.search ?? "",
          page: params.page ?? 1,
          per_page: params.perPage ?? 10,
        },
      }),
      transformResponse: (response: UserApiResponse) => {
        const transformedUsers = response.data.map((item) => ({
          ...item,
        }));

        return {
          users: transformedUsers,
          pagination: {
            total: response.page.total,
            perPage: response.page.per_page,
            currentPage: response.page.current_page,
            totalPages: response.page.total_page,
          },
        };
      },
      providesTags: (result) => {
        if (!result) {
          return [{ type: "Users" as const, id: "LIST" }];
        }

        return [
          ...result.users.map(
            (queue) => ({ type: "Users" as const, id: queue.id } as const)
          ),
          { type: "Users" as const, id: "LIST" },
        ];
      },
    }),

    getSingleUser: build.query({
      query: ({ id }) => `/users/detail/${id}`,
      providesTags: (result, error, { id }) =>
        result ? [{ type: "Users" as const, id }] : [],
    }),

    createUser: build.mutation({
      query: (data) => ({
        url: `/users/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),

    updateUser: build.mutation({
      query: (data) => {
        return {
          url: `/users/update`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Users" as const, id },
        { type: "Users" as const, id: "LIST" },
      ],
    }),

    deleteUser: build.mutation({
      query: ({ id }) => ({
        url: `/users/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Users" as const, id },
        { type: "Users" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetSingleUserQuery,
  useUpdateUserMutation,
  useCreateUserMutation,
} = userSlice;
