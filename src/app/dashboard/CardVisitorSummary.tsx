import React, { useState, useEffect } from "react";
import {
  useGetVisitorSummaryQuery,
  transformVisitorSummaryToChartData,
  processVisitorSummaryData,
} from "@/state/dashboardSlice";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns";

// Tipe untuk filter
type DateRangeFilter = "thisWeek" | "thisMonth" | "custom";

const CardVisitorSummary = () => {
  // State untuk filter
  const [dateRangeFilter, setDateRangeFilter] =
    useState<DateRangeFilter>("thisMonth");
  const [customStartDate, setCustomStartDate] = useState<string>(
    format(startOfMonth(new Date()), "yyyy-MM-dd")
  );
  const [customEndDate, setCustomEndDate] = useState<string>(
    format(endOfMonth(new Date()), "yyyy-MM-dd")
  );

  // State untuk trigger query
  const [queryParams, setQueryParams] = useState<{
    startDate?: string;
    endDate?: string;
  }>({
    startDate: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    endDate: format(endOfMonth(new Date()), "yyyy-MM-dd"),
  });

  // Effect untuk memperbarui query params saat filter berubah
  useEffect(() => {
    // Hitung rentang tanggal berdasarkan filter
    const getDateRange = () => {
      const today = new Date();

      switch (dateRangeFilter) {
        case "thisWeek":
          return {
            startDate: format(startOfWeek(today), "yyyy-MM-dd"),
            endDate: format(endOfWeek(today), "yyyy-MM-dd"),
          };
        case "thisMonth":
          return {
            startDate: format(startOfMonth(today), "yyyy-MM-dd"),
            endDate: format(endOfMonth(today), "yyyy-MM-dd"),
          };
        case "custom":
          return {
            startDate: customStartDate,
            endDate: customEndDate,
          };
      }
    };

    const newParams =
      dateRangeFilter !== "custom"
        ? getDateRange()
        : { startDate: customStartDate, endDate: customEndDate };

    // Validasi rentang tanggal
    if (newParams?.startDate && newParams?.endDate) {
      setQueryParams(newParams);
    }
  }, [dateRangeFilter, customStartDate, customEndDate]);

  // Query dengan rentang tanggal dinamis
  const { data, isLoading, isError } = useGetVisitorSummaryQuery(queryParams, {
    // Tambahkan skip untuk mencegah query awal yang tidak perlu
    skip: !queryParams.startDate || !queryParams.endDate,
  });

  // Transform data untuk chart
  const chartData = data ? transformVisitorSummaryToChartData(data) : [];

  // Proses data
  const processedData = data ? processVisitorSummaryData(chartData) : null;

  // Handler untuk validasi dan update tanggal custom
  const handleCustomDateChange = (type: "start" | "end", value: string) => {
    if (type === "start") {
      setCustomStartDate(value);

      // Pastikan tanggal awal tidak lebih besar dari tanggal akhir
      if (new Date(value) > new Date(customEndDate)) {
        setCustomEndDate(value);
      }
    } else {
      setCustomEndDate(value);

      // Pastikan tanggal akhir tidak lebih kecil dari tanggal awal
      if (new Date(value) < new Date(customStartDate)) {
        setCustomStartDate(value);
      }
    }
  };

  return (
    <div className="flex flex-col justify-between row-span-2 xl:row-span-3 col-span-1 md:col-span-2 xl:col-span-1 bg-white shadow-md rounded-2xl">
      {/* Filter Dropdown */}
      <div className="px-7 pt-5 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Total Kunjungan</h2>
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
          {/* Dropdown Filter */}
          <select
            value={dateRangeFilter}
            onChange={(e) =>
              setDateRangeFilter(e.target.value as DateRangeFilter)
            }
            className="px-2 py-1 border rounded"
          >
            <option value="thisWeek">Minggu Ini</option>
            <option value="thisMonth">Bulan Ini</option>
            <option value="custom">Custom</option>
          </select>

          {/* Custom Date Range */}
          {dateRangeFilter === "custom" && (
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) =>
                  handleCustomDateChange("start", e.target.value)
                }
                className="px-2 py-1 border rounded"
                max={customEndDate}
              />
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => handleCustomDateChange("end", e.target.value)}
                className="px-2 py-1 border rounded"
                min={customStartDate}
              />
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="m-5">Memuat...</div>
      ) : isError ? (
        <div className="m-5 text-red-500">Gagal memuat data</div>
      ) : (
        <>
          <hr className="mt-2" />

          {/* Body */}
          <div>
            {/* Statistik */}
            <div className="flex justify-between items-center mb-6 px-7 mt-5">
              <div className="text-lg font-medium">
                <p className="text-xs text-gray-400">Jumlah Kunjungan</p>
                <span className="text-2xl font-extrabold">
                  {processedData?.totalVisitors || 0}
                </span>
              </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={chartData}
                margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
                className="relative z-10"
              >
                <CartesianGrid strokeDasharray="" vertical={false} />
                <XAxis
                  dataKey="date"
                  interval="preserveStartEnd"
                  tickCount={10}
                />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="total"
                  fill="#16927E"
                  barSize={10}
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Footer */}
          <div>
            <hr />
            <div className="flex justify-between items-center mt-6 text-sm px-7 mb-4">
              <p>Total Hari: {chartData.length || 0}</p>
              <p>
                Kunjungan Terbanyak:
                <span className="font-bold ml-2">
                  {processedData?.maxVisitorDay?.total || 0}
                </span>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CardVisitorSummary;
