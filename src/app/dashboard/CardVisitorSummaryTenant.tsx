import {
  transformVisitorSummaryTennantToChartData,
  useGetVisitorSummaryTennantQuery,
} from "@/state/dashboardSlice";
import {
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAppSelector } from "../redux";
import { TooltipProps } from "recharts";
import useAgencies from "@/hooks/useAgencies";
import useServices from "@/hooks/useServices";

type CustomValueType = string | number;

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<CustomValueType, CustomValueType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-300 rounded shadow-lg p-2">
        <p className="label mb-3">{label}</p>
        <p className="desc text-[#1A937D]">Booked: {payload[0].value}</p>
        <p className="desc text-[#6CAC6F]">Proses: {payload[1].value}</p>
        <p className="desc text-[#BEC461]">Selesai: {payload[2].value}</p>
      </div>
    );
  }

  return null;
};

// Tipe untuk filter
type DateRangeFilter = "thisWeek" | "thisMonth" | "custom";

const CardVisitorSummaryTennant = () => {
  const user = useAppSelector((state) => state.auth.user);

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
    agency?: string;
    service?: string;
  }>({
    startDate: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    endDate: format(endOfMonth(new Date()), "yyyy-MM-dd"),
  });

  // State untuk filters
  const [filters, setFilters] = useState({
    agency: "",
    service: "",
  });

  // Fetch agencies and services
  const { agencyList, isLoading: isLoadingAgency } = useAgencies();
  const { serviceList, isLoading: isLoadingService } = useServices(
    user?.nama_role === "OPERATOR" ? user?.id_instansi : filters.agency
  );

  // Effect untuk memperbarui query params saat filter berubah
  useEffect(() => {
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
      setQueryParams({
        ...newParams,
        agency:
          user?.nama_role == "OPERATOR" ? user?.id_instansi : filters.agency,
        service: filters.service,
      });
    }
  }, [dateRangeFilter, customStartDate, customEndDate, filters]);

  // Query dengan rentang tanggal dinamis
  const { data, isLoading, isError } = useGetVisitorSummaryTennantQuery(
    queryParams,
    {
      skip: !queryParams.startDate || !queryParams.endDate,
    }
  );

  // Transform data untuk chart
  const chartData = data ? transformVisitorSummaryTennantToChartData(data) : [];

  // Handler untuk validasi dan update tanggal custom
  const handleCustomDateChange = (type: "start" | "end", value: string) => {
    if (type === "start") {
      setCustomStartDate(value);
      if (new Date(value) > new Date(customEndDate)) {
        setCustomEndDate(value);
      }
    } else {
      setCustomEndDate(value);
      if (new Date(value) < new Date(customStartDate)) {
        setCustomStartDate(value);
      }
    }
  };

  // Handler untuk perubahan filter
  const handleFilterChange = (
    filterType: "agency" | "service",
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Fungsi untuk mereset filter
  const resetFilters = () => {
    setDateRangeFilter("thisMonth");
    setCustomStartDate(format(startOfMonth(new Date()), "yyyy-MM-dd"));
    setCustomEndDate(format(endOfMonth(new Date()), "yyyy-MM-dd"));
    setFilters({ agency: "", service: "" });
  };

  return (
    <div className="flex flex-col justify-between row-span-2 xl:row-span-3 col-span-1 md:col-span-2 xl:col-span-1 bg-white shadow-md rounded-2xl">
      {/* Filter Dropdown */}
      <div className="px-7 pt-5 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Kunjungan Tenant</h2>
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
          {/* Dropdown Filter for Agency */}
          {user?.nama_role != "OPERATOR" && (
            <div className="select-container">
              <select
                id="agency-select"
                className="px-2 py-1 border rounded"
                value={filters.agency}
                onChange={(e) => handleFilterChange("agency", e.target.value)}
              >
                <option value="">Pilih Instansi</option>
                {agencyList.map((agency) => (
                  <option key={agency.value} value={agency.value}>
                    {agency.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Dropdown Filter for Service */}
          <div className="select-container">
            <select
              id="service-select"
              className="px-2 py-1 border rounded"
              value={filters.service}
              onChange={(e) => handleFilterChange("service", e.target.value)}
            >
              <option value="">Pilih Layanan</option>
              {serviceList.map((service) => (
                <option key={service.value} value={service.value}>
                  {service.label}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown Filter for Date Range */}
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

          {/* Reset Filters Button */}
          <button
            onClick={resetFilters}
            className="flex items-center px-2 py-1 text-gray-700 hover:bg-gray-200"
          >
            <RefreshCcw />
          </button>
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
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="booked"
                  fill="#1A937D"
                  barSize={10}
                  radius={[5, 5, 0, 0]}
                />
                <Bar
                  dataKey="present"
                  fill="#6CAC6F"
                  barSize={10}
                  radius={[5, 5, 0, 0]}
                />
                <Bar
                  dataKey="finish"
                  fill="#BEC461"
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
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CardVisitorSummaryTennant;
