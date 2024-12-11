import useServices from "@/hooks/useServices";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Filter as FilterIcon, Search as SearchIcon } from "lucide-react";
import { useCallback, useMemo } from "react";
import DatePicker from "react-datepicker";
import ErrorDisplay from "../(components)/ErrorDisplay";
import LoadingSpinner from "../(components)/LoadingSpinner";

// Definisikan tipe DateRange yang lebih fleksibel
interface DateRange {
  from?: Date | null;
  to?: Date | null;
}

// Perbarui tipe filter
interface FilterState {
  search: string;
  status: string;
  service: string;
  dateRange: DateRange;
}

// Di QueueFilter.tsx
interface FilterProps {
  filters: FilterState;
  updateFilters: (updates: Partial<FilterState>) => void;
  onReset: () => void;
}

const QueueFilter = ({ filters, updateFilters, onReset }: FilterProps) => {
  const { serviceList, isLoading, error, refetch } = useServices();

  // Memoize service menu items
  const serviceMenuItems = useMemo(
    () =>
      serviceList.map((opt) => (
        <MenuItem key={opt.value} value={opt.value.toString()}>
          {opt.label}
        </MenuItem>
      )),
    [serviceList]
  );

  // Handler untuk update filter
  const handleFilterChange = useCallback(
    (key: keyof FilterProps["filters"], value: string | DateRange) => {
      updateFilters({ [key]: value });
    },
    [updateFilters]
  );

  // Render loading atau error
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay callback={refetch} />;

  return (
    <div className="space-y-4 mb-8">
      {/* Search Bar */}
      <div className="mb-4">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-2 rounded bg-white"
            placeholder="Cari Antrian..."
            value={filters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>
      </div>

      {/* Filter Container */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Filter Status */}
        <div>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              value={filters.status || ""}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              label="Status"
            >
              <MenuItem value="0">Dalam Proses</MenuItem>
              <MenuItem value="1">Selesai</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Filter Layanan */}
        <div>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="service-select-label">Layanan</InputLabel>
            <Select
              labelId="service-select-label"
              value={filters.service || ""}
              onChange={(e) => handleFilterChange("service", e.target.value)}
              label="Layanan"
            >
              {serviceMenuItems}
            </Select>
          </FormControl>
        </div>

        {/* Filter Tanggal */}
        <div className="flex flex-col gap-2">
          <DatePicker
            selected={filters.dateRange?.from || null}
            onChange={(date) =>
              handleFilterChange("dateRange", {
                ...filters.dateRange,
                from: date,
              })
            }
            selectsStart
            startDate={filters.dateRange?.from || undefined}
            endDate={filters.dateRange?.to || undefined}
            dateFormat="dd/MM/yyyy"
            placeholderText="Tanggal Mulai"
            className="w-full border-2 border-gray-200 rounded py-2 px-2"
          />
          <DatePicker
            selected={filters.dateRange?.to || null}
            onChange={(date) =>
              handleFilterChange("dateRange", {
                ...filters.dateRange,
                to: date,
              })
            }
            selectsEnd
            startDate={filters.dateRange?.from || undefined}
            endDate={filters.dateRange?.to || undefined}
            minDate={filters.dateRange?.from || undefined}
            dateFormat="dd/MM/yyyy"
            placeholderText="Tanggal Selesai"
            className="w-full border-2 border-gray-200 rounded py-2 px-2"
          />
        </div>

        {/* Tombol Reset */}
        <div className="flex flex-col gap-2">
          <Button variant="outlined" className="w-full" onClick={onReset}>
            <FilterIcon className="mr-2 h-4 w-4" />
            Reset Filter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QueueFilter;
