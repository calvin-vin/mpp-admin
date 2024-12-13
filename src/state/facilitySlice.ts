import { apiSlice } from "./apiSlice";

export interface Facility {
  id_fasilitas: number;
  nama_fasilitas: string;
  deskripsi: string;
  aktif: string;
  foto: string | null;
}

export interface FacilityApiResponse {
  status: string;
  message: string;
  data: Facility[];
  page: {
    total: number;
    per_page: number;
    current_page: number;
    total_page: number;
  };
}

export const queueSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getFacilities: build.query({
      query: (params = {}) => ({
        url: "/fasilitas/list",
        params: {
          keyword: params.search || "",
          page: params.page ?? 1,
          per_page: params.perPage ?? 10,
        },
      }),
      transformResponse: (response: FacilityApiResponse) => {
        const transformedFacilities = response.data.map((item) => ({
          ...item,
        }));

        return {
          facilities: transformedFacilities,
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
          return [{ type: "Facilities" as const, id: "LIST" }];
        }

        return [
          ...result.facilities.map(
            (facility) =>
              ({
                type: "Facilities" as const,
                id: facility.id_fasilitas,
              } as const)
          ),
          { type: "Facilities" as const, id: "LIST" },
        ];
      },
    }),

    getSingleFacility: build.query({
      query: ({ id }) => `/fasilitas/detail/${id}`,
      providesTags: (result, error, { id }) =>
        result
          ? [
              { type: "Facilities" as const, id },
              { type: "Facilities" as const, id: "DETAIL" },
            ]
          : [],
    }),

    createFacility: build.mutation({
      query: (data) => ({
        url: `/fasilitas/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Facilities", id: "LIST" }],
    }),

    updateFacility: build.mutation({
      query: (data) => {
        return {
          url: `/fasilitas/update`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: (result, error, { id_fasilitas }) => [
        { type: "Facilities" as const, id: id_fasilitas },
        { type: "Facilities" as const, id: "LIST" },
      ],
    }),

    deleteFacility: build.mutation({
      query: ({ id }) => ({
        url: `/fasilitas/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Facilities" as const, id },
        { type: "Facilities" as const, id: "LIST" },
      ],
    }),

    deletePhotoFacility: build.mutation({
      query: ({ id }) => ({
        url: `/fasilitas/foto/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Facilities" as const, id }, // Invalidate specific facility
        { type: "Facilities" as const, id: "LIST" }, // Invalidate facility list
        { type: "Facilities" as const, id: "DETAIL" }, // Add a new tag for facility details
      ],
    }),
  }),
});

export const {
  useGetFacilitiesQuery,
  useDeleteFacilityMutation,
  useGetSingleFacilityQuery,
  useUpdateFacilityMutation,
  useCreateFacilityMutation,
  useDeletePhotoFacilityMutation,
} = queueSlice;
