import { apiSlice, PaginationMeta } from "./apiSlice";

// Interface untuk Service
export interface Service {
  id: number;
  layanan: string;
  id_layanan: number;
  created_at: string;
  updated_at: string;
}

// Interface untuk response API Service
export interface ServiceApiResponse {
  status: string;
  message: string;
  data: Service[];
  page: {
    total: number;
    per_page: string;
    current_page: string;
    total_page: number;
  };
}

// Interface untuk parameter query
interface GetServicesParams {
  page?: number;
  perPage?: number;
}

// Slice untuk service
export const serviceSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // Endpoint untuk mendapatkan semua layanan
    getAllServices: build.query<
      {
        services: Service[];
        pagination: PaginationMeta;
      },
      GetServicesParams
    >({
      query: (params = {}) => ({
        url: "/layanan/list",
        params: {
          page: params.page ?? 1,
          per_page: params.perPage ?? 10,
        },
      }),
      transformResponse: (response: ServiceApiResponse) => {
        // Transform data sesuai kebutuhan
        const transformedServices = response.data.map((service) => ({
          ...service,
        }));

        return {
          services: transformedServices,
          pagination: {
            total: response.page.total,
            perPage: Number(response.page.per_page),
            currentPage: Number(response.page.current_page),
            totalPages: response.page.total_page,
          },
        };
      },
      // Provide tags untuk caching dan invalidation
      providesTags: (result) => {
        if (!result) {
          return [{ type: "Services" as const, id: "LIST" }];
        }

        return [
          ...result.services.map(
            (service) =>
              ({ type: "Services" as const, id: service.id } as const)
          ),
          { type: "Services" as const, id: "LIST" },
        ];
      },
    }),

    // Query untuk mendapatkan detail service
    getServiceById: build.query({
      query: ({ serviceId }) => `/layanan/detail/${serviceId}`,
      providesTags: (result, error, { serviceId }) => [
        { type: "Services", id: serviceId },
      ],
    }),

    // Mutation untuk membuat service baru
    createService: build.mutation({
      query: (data) => ({
        url: `/layanan/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, data) => [
        { type: "Services", id: `Agencies${data.id_instansi}` },
        { type: "Agencies", id: data.id_instansi },
      ],
    }),

    // Mutation untuk update service
    updateService: build.mutation({
      query: (data) => {
        return {
          url: `/layanan/update`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: (result, error, { id_layanan, id_instansi }) => {
        return [
          { type: "Services", id: id_layanan },
          { type: "Services", id: `Agencies${id_instansi}` },
          { type: "Agencies", id: id_instansi },
        ];
      },
    }),

    // Mutation untuk menghapus service
    deleteService: build.mutation({
      query: ({ serviceId, agencyId }) => ({
        url: `/layanan/delete/${serviceId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { agencyId }) => [
        { type: "Services", id: `Agencies${agencyId}` },
        { type: "Agencies", id: agencyId },
      ],
    }),
  }),
});

// Export hooks untuk digunakan di komponen
export const {
  useGetServiceByIdQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = serviceSlice;
