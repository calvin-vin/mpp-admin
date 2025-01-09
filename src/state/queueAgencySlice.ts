import { format } from "date-fns";
import type { PaginationMeta } from "./apiSlice";
import { apiSlice } from "./apiSlice";

export interface QueueAgency {
  id: number;
  kode: string;
  jenis_permohonan: string;
  nama_lengkap: string;
  usia: number;
  jenis_kelamin: string;
  pendidikan: string;
  status_kawin: string;
  pekerjaan: string;
  tanggal: string;
  jam: string;
  mobile: string;
  id_layanan: string;
  created_at: string;
  updated_at: string;
}

export interface QueueAgencyApiResponse {
  status: string;
  message: string;
  data: QueueAgency[];
  page: {
    total: number;
    per_page: number;
    current_page: number;
    total_page: number;
  };
}

interface GetQueueAgencyParams {
  search?: string;
  status?: string;
  service?: string;
  agency?: string;
  dateRange?: {
    from?: string;
    to?: string;
  };
  page?: number;
  perPage?: number;
}

export const queueSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getQueueAgency: build.query<
      { queues: QueueAgency[]; pagination: PaginationMeta },
      GetQueueAgencyParams
    >({
      query: (params = {}) => {
        return {
          url: "/antrian-instansi/list",
          params: {
            keyword: params.search ?? "",
            is_attend: params.status ?? "",
            id_layanan: params.service ?? "",
            id_instansi: params.agency ?? "",
            start_date: params.dateRange?.from
              ? format(params.dateRange.from, "yyyy-MM-dd")
              : "",
            end_date: params.dateRange?.to
              ? format(params.dateRange.to, "yyyy-MM-dd")
              : "",
            page: params.page ?? 1,
            per_page: params.perPage ?? 10,
          },
        };
      },
      transformResponse: (response: QueueAgencyApiResponse) => {
        const transformedQueues = response.data.map((item) => ({
          ...item,
          usia: Number(item.usia) || 0,
          jenis_permohonan: item.jenis_permohonan || "",
          status_kawin: item.status_kawin || "",
        }));

        return {
          queues: transformedQueues,
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
          return [{ type: "Queues" as const, id: "LIST" }];
        }

        return [
          ...result.queues.map(
            (queue) => ({ type: "Queues" as const, id: queue.id } as const)
          ),
          { type: "Queues" as const, id: "LIST" },
        ];
      },
    }),

    getSingleQueueAgency: build.query({
      query: ({ id }) => `/antrian-instansi/detail/${id}`,
      providesTags: (result, error, { id }) =>
        result ? [{ type: "Queues" as const, id }] : [],
    }),

    updateQueueAgency: build.mutation({
      query: (data) => {
        return {
          url: `/antrian/update`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Queues" as const, id },
        { type: "Queues" as const, id: "LIST" },
      ],
    }),

    updateQueueAgencyStatusToPresent: build.mutation({
      query: (data) => {
        return {
          url: `/antrian-instansi/status/present`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: (result, error, { id_antrian }) => [
        { type: "Queues" as const, id: id_antrian },
        { type: "Queues" as const, id: "LIST" },
      ],
    }),

    updateQueueAgencyStatusToFinish: build.mutation({
      query: (data) => {
        return {
          url: `/antrian-instansi/status/finish`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: (result, error, { id_antrian }) => [
        { type: "Queues" as const, id: id_antrian },
        { type: "Queues" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetQueueAgencyQuery,
  useGetSingleQueueAgencyQuery,
  useUpdateQueueAgencyMutation,
  useUpdateQueueAgencyStatusToFinishMutation,
  useUpdateQueueAgencyStatusToPresentMutation,
} = queueSlice;
