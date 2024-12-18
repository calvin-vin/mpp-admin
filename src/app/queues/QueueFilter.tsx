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
import useAgencies from "@/hooks/useAgencies";

// Definisikan tipe DateRange yang lebih fleksibel
interface DateRange {
  from?: Date | null;
  to?: Date | null;
}

// Perbarui tipe filter
interface FilterState {
  search: string;
  service: string;
  agency: string;
  dateRange: DateRange;
}

// Di QueueFilter.tsx
interface FilterProps {
  filters: FilterState;
  updateFilters: (updates: Partial<FilterState>) => void;
  onReset: () => void;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const QueueFilter = ({
  filters,
  updateFilters,
  onReset,
  searchTerm,
  setSearchTerm,
}: FilterProps) => {
  const {
    serviceList,
    isLoading: isLoadingService,
    error: errorService,
    refetch: refetchService,
  } = useServices();
  const {
    agencyList,
    isLoading: isLoadingAgency,
    error: errorAgency,
    refetch: refetchAgency,
  } = useAgencies();

  const serviceMenuItems = useMemo(
    () =>
      serviceList.map((opt) => (
        <MenuItem key={opt.value} value={opt.value.toString()}>
          {opt.label}
        </MenuItem>
      )),
    [serviceList]
  );

  const agencyMenuItems = useMemo(
    () =>
      agencyList.map((opt) => (
        <MenuItem key={opt.value} value={opt.value.toString()}>
          {opt.label}
        </MenuItem>
      )),
    [agencyList]
  );

  // Handler untuk update filter
  const handleFilterChange = useCallback(
    (key: keyof FilterProps["filters"], value: string | DateRange) => {
      updateFilters({ [key]: value });
    },
    [updateFilters]
  );

  if (isLoadingService || isLoadingAgency) return <LoadingSpinner />;
  if (errorAgency || errorService)
    return (
      <ErrorDisplay
        callback={() => {
          refetchAgency();
          refetchService();
        }}
      />
    );

  return (
    <div className="space-y-4 mb-8">
      {/* Search Bar */}
      <div className="mb-4">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-2 rounded bg-white"
            placeholder="Cari Antrian..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Container */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Filter Instansi */}
        <div>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="agency-select-label">Instansi</InputLabel>
            <Select
              labelId="agency-select-label"
              value={filters.agency || ""}
              onChange={(e) => handleFilterChange("agency", e.target.value)}
              label="Instansi"
            >
              {agencyMenuItems}
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
            onChange={(date: Date | null) =>
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
            onChange={(date: Date | null) =>
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
