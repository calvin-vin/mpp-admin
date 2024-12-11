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

interface AgencyQueueCountResponse {
  status: string;
  data: AgencyQueueCountItem[];
}

// Definisikan interface untuk tipe data
interface DashboardSummaryData {
  total_agencies: number;
  total_services: number;
  total_queues: number;
}

interface DashboardSummaryResponse {
  status: string;
  data: DashboardSummaryData;
}

// Di dashboardSlice.ts
export const dashboardSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getVisitorSummary: build.query<
      VisitorSummaryResponse,
      { startDate?: string; endDate?: string } | undefined
    >({
      query: (params) => {
        // Pastikan parameter tidak undefined
        const queryParams = params || {};
        return {
          url: "/dashboard/visitor-summary",
          method: "GET",
          params: {
            start_date: queryParams.startDate,
            end_date: queryParams.endDate,
          },
        };
      },
      // Caching query berdasarkan parameter
      serializeQueryArgs: ({ queryArgs }) => {
        return queryArgs
          ? `${queryArgs.startDate}-${queryArgs.endDate}`
          : "default";
      },
      // Menggabungkan cache jika diperlukan
      merge: (currentCache, newItems) => {
        return newItems;
      },
      // Invalidate cache ketika perlu
      providesTags: (result, error, arg) =>
        result ? ["DashboardMetrics"] : [],
    }),
    getAgencyQueueCount: build.query<AgencyQueueCountResponse, void>({
      query: () => ({
        url: "/dashboard/agency-queue-count", // Sesuaikan dengan endpoint aktual
        method: "GET",
      }),
      // Opsional: Caching dan invalidasi
      providesTags: ["DashboardMetrics"],
    }),
    getDashboardSummary: build.query<DashboardSummaryResponse, void>({
      query: () => ({
        url: "/dashboard/total-count", // Sesuaikan dengan endpoint aktual
        method: "GET",
      }),
      // Opsional: Caching dan invalidasi
      providesTags: ["DashboardMetrics"],
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
    { date: "", total: 0 }
  );

  return {
    totalVisitors,
    maxVisitorDay,
    data,
  };
};

// Fungsi utility untuk transformasi data (opsional)
export const transformAgencyQueueCountData = (data: AgencyQueueCountItem[]) => {
  // Urutkan dari total terbanyak
  return [...data].sort((a, b) => b.total - a.total);
};

// Fungsi untuk mencari total keseluruhan (opsional)
export const calculateTotalQueueCount = (data: AgencyQueueCountItem[]) => {
  return data.reduce((sum, item) => sum + item.total, 0);
};

// Hooks yang di-generate otomatis
export const {
  useGetVisitorSummaryQuery,
  useLazyGetVisitorSummaryQuery,
  useGetAgencyQueueCountQuery,
  useGetDashboardSummaryQuery,
} = dashboardSlice;
