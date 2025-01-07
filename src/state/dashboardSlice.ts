import { apiSlice } from "./apiSlice";

// Definisi tipe untuk parameter query
interface VisitorSummaryParams {
  startDate?: string;
  endDate?: string;
}

// Definisi tipe untuk respons
interface VisitorSummaryResponse {
  status: string;
  data: {
    visitorCounts: number[];
    dateLabels: string[];
  };
}

// Tipe untuk data yang akan digunakan di chart
interface ChartData {
  date: string;
  total: number;
}

interface AgencyQueueCountItem {
  name: string;
  total: number;
}

interface DashboardSummaryData {
  total_agencies: number;
  total_services: number;
  total_queues: number;
}

interface DashboardSummaryResponse {
  status: string;
  data: DashboardSummaryData;
}

interface AgencyQueueCountDataResponse {
  status: string;
  data: {
    visitorCounts: number[];
    dataLabels: string[];
  };
}

// Di dashboardSlice.ts
export const dashboardSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getVisitorSummary: build.query<
      VisitorSummaryResponse,
      | {
          startDate?: string;
          endDate?: string;
          agency?: string;
          service?: string;
        }
      | undefined
    >({
      query: (params) => {
        const queryParams = params || {};
        return {
          url: "/dashboard/antrian-summary/list",
          method: "GET",
          params: {
            start_date: queryParams.startDate,
            end_date: queryParams.endDate,
            id_instansi: queryParams.agency,
            id_layanan: queryParams.service,
          },
        };
      },
      // Menggabungkan cache jika diperlukan
      merge: (currentCache, newItems) => {
        return newItems;
      },
      // Invalidate cache ketika perlu
      providesTags: (result, error, arg) =>
        result ? ["DashboardMetrics"] : [],
    }),
    getDashboardSummary: build.query<DashboardSummaryResponse, void>({
      query: () => ({
        url: "/dashboard/total/list",
        method: "GET",
      }),
      providesTags: ["DashboardMetrics"],
    }),
    getAgencyQueueCount: build.query<
      AgencyQueueCountDataResponse,
      | {
          startDate?: string;
          endDate?: string;
        }
      | undefined
    >({
      query: (params) => {
        const queryParams = params || {};
        return {
          url: "/dashboard/antrian-instansi/list",
          method: "GET",
          params: {
            start_date: queryParams.startDate,
            end_date: queryParams.endDate,
          },
        };
      },
      providesTags: (result, error, arg) =>
        result ? ["DashboardMetrics"] : [],
    }),
  }),
});
// Utility function untuk mengolah data chart
export const transformVisitorSummaryToChartData = (
  response: VisitorSummaryResponse
): ChartData[] => {
  return response.data.dateLabels.map((date, index) => ({
    date,
    total: response.data.visitorCounts[index],
  }));
};

// Utility function untuk mengolah data
export const processVisitorSummaryData = (data: ChartData[]) => {
  // Hitung total pengunjung
  const totalVisitors = data.reduce((sum, item) => sum + item.total, 0);

  // Cari hari dengan kunjungan tertinggi
  const maxVisitorDay = data.reduce(
    (max, item) => (item.total > max.total ? item : max),
    { instansi: "", total: 0 }
  );

  return {
    totalVisitors,
    maxVisitorDay,
    data,
  };
};

export const transformAgencyQueueToChartData = (
  response: AgencyQueueCountDataResponse
): ChartData[] => {
  return response.data.dataLabels.map((date, index) => ({
    date,
    total: response.data.visitorCounts[index],
  }));
};

export const processAgencyQueueData = (data: ChartData[]) => {
  // Hitung total pengunjung
  const totalVisitors = data.reduce((sum, item) => sum + item.total, 0);

  // Cari instansi dengan kunjungan tertinggi
  const maxAgencyVisitor = data.reduce(
    (max, item) => (item.total > max.total ? item : max),
    { date: "", total: 0 }
  );

  return {
    totalVisitors,
    maxAgencyVisitor,
    data,
  };
};

// Hooks yang di-generate otomatis
export const {
  useGetVisitorSummaryQuery,
  useLazyGetVisitorSummaryQuery,
  useGetAgencyQueueCountQuery,
  useGetDashboardSummaryQuery,
} = dashboardSlice;
