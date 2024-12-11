import { apiSlice } from "./apiSlice";

// Interface untuk Instansi
export interface Agency {
  id_instansi: number;
  instansi: string;
  kode: string;
  no_tenant: string;
  jumlah_petugas: number;
  logo: string | null;
  aktif: string;
  created_at?: string;
  updated_at?: string;
}

// Interface untuk response API
export interface AgencyApiResponse {
  status: string;
  message: string;
  data: Agency[];
  page: {
    total: number;
    per_page: string;
    current_page: string;
    total_page: number;
  };
}

// agency.utils.ts
export const transformAgencyResponse = (response: AgencyApiResponse) => ({
  agencies: response.data.map((item) => ({ ...item })),
  pagination: {
    total: response.page.total,
    perPage: Number(response.page.per_page),
    currentPage: Number(response.page.current_page),
    totalPages: response.page.total_page,
  },
});

// Fungsi utilitas tambahan
export const createAgencyTagsGenerator = (agencies: Agency[]) => [
  ...agencies.map((agency) => ({
    type: "Agencies" as const,
    id: agency.id_instansi,
  })),
  { type: "Agencies" as const, id: "LIST" },
];

// Slice untuk instansi
export const agencySlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // Query untuk mendapatkan daftar instansi
    getAgencies: build.query<
      ReturnType<typeof transformAgencyResponse>,
      {
        search?: string;
        page?: number;
        perPage?: number;
      }
    >({
      query: (params = {}) => ({
        url: "/instansi/list",
        params: {
          keyword: params.search || "",
          page: params.page || 1,
          per_page: params.perPage || 999,
        },
      }),
      transformResponse: transformAgencyResponse,
      providesTags: (result) =>
        result
          ? createAgencyTagsGenerator(result.agencies)
          : [{ type: "Agencies" as const, id: "LIST" }],
    }),

    // Query untuk mendapatkan detail instansi berdasarkan ID
    getAgencyById: build.query({
      query: ({ id }) => `/instansi/detail/${id}`,
      providesTags: (result, error, { id }) => [
        { type: "Agencies", id },
        { type: "Services", id: `Agencies${id}` },
      ],
    }),

    // Mutation untuk membuat instansi baru
    createAgency: build.mutation<Agency, FormData>({
      query: (newAgency) => ({
        url: "/instansi/create",
        method: "POST",
        body: newAgency,
      }),
      invalidatesTags: [{ type: "Agencies", id: "LIST" }],
    }),

    // Mutation untuk update agency
    updateAgency: build.mutation({
      query: (data) => ({
        url: `/instansi/update`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Agencies"],
    }),

    // Mutation untuk delete agency
    deleteAgency: build.mutation({
      query: ({ id }) => ({
        url: `/instansi/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Agencies"],
    }),
  }),
});

export const {
  useGetAgenciesQuery,
  useGetAgencyByIdQuery,
  useCreateAgencyMutation,
  useUpdateAgencyMutation,
  useDeleteAgencyMutation,
} = agencySlice;
