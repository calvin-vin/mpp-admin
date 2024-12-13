import type { PaginationMeta } from "./apiSlice";
import { apiSlice } from "./apiSlice";

export interface Role {
  id: string;
  nama: string;
  status: string;
  menu: string[];
}

export interface RoleApiResponse {
  status: string;
  message: string;
  data: Role[];
  page: {
    total: number;
    per_page: number;
    current_page: number;
    total_page: number;
  };
}

interface GetRolesParams {
  page?: number;
  perPage?: number;
}

export const roleSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getRoles: build.query<
      { roles: Role[]; pagination: PaginationMeta },
      GetRolesParams
    >({
      query: (params = {}) => ({
        url: "/role/list",
        params: {
          page: params.page ?? 1,
          per_page: params.perPage ?? 10,
        },
      }),
      transformResponse: (response: RoleApiResponse) => {
        const transformedRoles = response.data.map((item) => ({
          ...item,
        }));

        return {
          roles: transformedRoles,
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
          return [{ type: "Roles" as const, id: "LIST" }];
        }

        return [
          ...result.roles.map(
            (queue) => ({ type: "Roles" as const, id: queue.id } as const)
          ),
          { type: "Roles" as const, id: "LIST" },
        ];
      },
    }),

    getSingleRole: build.query({
      query: ({ id }) => `/role/detail/${id}`,
      providesTags: (result, error, { id }) =>
        result ? [{ type: "Roles" as const, id }] : [],
    }),

    createRole: build.mutation({
      query: (data) => ({
        url: `/role/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Roles", id: "LIST" }],
    }),

    updateRole: build.mutation({
      query: (data) => {
        return {
          url: `/role/update`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Roles" as const, id },
        { type: "Roles" as const, id: "LIST" },
      ],
    }),

    deleteRole: build.mutation({
      query: ({ id }) => ({
        url: `/role/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Roles" as const, id },
        { type: "Roles" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useDeleteRoleMutation,
  useGetSingleRoleQuery,
  useUpdateRoleMutation,
  useCreateRoleMutation,
} = roleSlice;
