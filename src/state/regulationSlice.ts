import { apiSlice } from "./apiSlice";

// Interface untuk Regulasi
export interface Regulation {
  id_regulasi: number;
  judul: string;
  file_url: string;
  aktif: string;
  created_at?: string;
  updated_at?: string;
}

// Interface untuk response API
export interface RegulationApiResponse {
  status: string;
  message: string;
  data: Regulation[];
  page: {
    total: number;
    per_page: string;
    current_page: string;
    total_page: number;
  };
}

// Regulation.utils.ts
export const transformRegulationResponse = (
  response: RegulationApiResponse
) => ({
  regulation: response.data.map((item) => ({ ...item })),
  pagination: {
    total: response.page.total,
    perPage: Number(response.page.per_page),
    currentPage: Number(response.page.current_page),
    totalPages: response.page.total_page,
  },
});

// Fungsi utilitas tambahan
export const createRegulationTagsGenerator = (regulation: Regulation[]) => [
  ...regulation.map((Regulation) => ({
    type: "Regulation" as const,
    id: Regulation.id_regulasi,
  })),
  { type: "Regulation" as const, id: "LIST" },
];

// Slice untuk regulasi
export const regulationSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // Query untuk mendapatkan daftar regulasi
    getRegulation: build.query<
      ReturnType<typeof transformRegulationResponse>,
      {
        search?: string;
        page?: number;
        perPage?: number;
      }
    >({
      query: (params = {}) => ({
        url: "/regulasi/list",
        params: {
          keyword: params.search || "",
          page: params.page || 1,
          per_page: params.perPage || 10,
        },
      }),
      transformResponse: transformRegulationResponse,
      providesTags: (result) =>
        result
          ? createRegulationTagsGenerator(result.regulation)
          : [{ type: "Regulation" as const, id: "LIST" }],
    }),

    // Query untuk mendapatkan detail regulasi
    getSingleRegulation: build.query({
      query: ({ id }) => ({
        url: `/regulasi/detail/${id}`,
      }),
      providesTags: (result, error, arg) =>
        result ? [{ type: "Regulation", id: arg.id }] : [],
    }),

    // Mutation untuk membuat regulasi baru
    createRegulation: build.mutation<Regulation, FormData>({
      query: (newRegulation) => ({
        url: "/regulasi/create",
        method: "POST",
        body: newRegulation,
      }),
      invalidatesTags: [{ type: "Regulation", id: "LIST" }],
    }),

    // Mutation untuk update regulasi
    updateRegulation: build.mutation({
      query: (formData) => ({
        url: "/regulasi/update",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, arg) => [
        "Regulation",
        { type: "Regulation", id: arg.get("id_regulasi") },
      ],
    }),

    // Mutation untuk delete Regulation
    deleteRegulation: build.mutation({
      query: ({ id }) => ({
        url: `/regulasi/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Regulation"],
    }),
  }),
});

export const {
  useGetRegulationQuery,
  useGetSingleRegulationQuery,
  useCreateRegulationMutation,
  useUpdateRegulationMutation,
  useDeleteRegulationMutation,
} = regulationSlice;
