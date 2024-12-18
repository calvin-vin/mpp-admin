import { format } from "date-fns";
import type { PaginationMeta } from "./apiSlice";
import { apiSlice } from "./apiSlice";

// Gunakan tipe yang lebih ketat dan deskriptif
export interface Queue {
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

export interface QueueApiResponse {
  status: string;
  message: string;
  data: Queue[];
  page: {
    total: number;
    per_page: number;
    current_page: number;
    total_page: number;
  };
}

// Interface untuk parameter query
interface GetQueuesParams {
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
    getQueues: build.query<
      { queues: Queue[]; pagination: PaginationMeta },
      GetQueuesParams
    >({
      query: (params = {}) => {
        return {
          url: "/antrian/list",
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
      transformResponse: (response: QueueApiResponse) => {
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

    getSingleQueue: build.query({
      query: ({ id }) => `/antrian/detail/${id}`,
      providesTags: (result, error, { id }) =>
        result ? [{ type: "Queues" as const, id }] : [],
    }),

    createQueue: build.mutation({
      query: (data) => ({
        url: `/antrian/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Queues", id: "LIST" }],
    }),

    updateQueue: build.mutation({
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

    updateQueueStatusToPresent: build.mutation({
      query: (data) => {
        return {
          url: `/antrian/status/present`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: (result, error, { id_antrian }) => [
        { type: "Queues" as const, id: id_antrian },
        { type: "Queues" as const, id: "LIST" },
      ],
    }),

    updateQueueStatusToFinish: build.mutation({
      query: (data) => {
        return {
          url: `/antrian/status/finish`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: (result, error, { id_antrian }) => [
        { type: "Queues" as const, id: id_antrian },
        { type: "Queues" as const, id: "LIST" },
      ],
    }),

    deleteQueue: build.mutation({
      query: ({ id }) => ({
        url: `/antrian/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Queues" as const, id },
        { type: "Queues" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetQueuesQuery,
  useDeleteQueueMutation,
  useGetSingleQueueQuery,
  useUpdateQueueMutation,
  useCreateQueueMutation,
  useUpdateQueueStatusToFinishMutation,
  useUpdateQueueStatusToPresentMutation,
} = queueSlice;
