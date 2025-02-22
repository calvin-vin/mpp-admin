"use client";

import type { Queue } from "@/state/queueSlice";

import Header from "@/app/(components)/Header";
import useDebounce from "@/hooks/useDebounce";
import { usePusherSubscription } from "@/hooks/usePusherSubscription";
import { useGetQueueAgencyQuery } from "@/state/queueAgencySlice";
import { DATA_PER_PAGE } from "@/utils/constants";
import { formattedDate } from "@/utils/helpers";
import { EditIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Datatable from "../(components)/Datatable";
import ErrorDisplay from "../(components)/ErrorDisplay";
import { useAppSelector } from "../redux";
import ChangeStatus from "./ChangeStatus";
import QueueFilter from "./QueueFilter";
import DownloadExcel from "./DownloadExcel";

// Definisikan tipe DateRange dan FilterState seperti di QueueFilter
interface DateRange {
  from?: Date | null;
  to?: Date | null;
}

interface FilterState {
  search: string;
  service: string;
  dateRange: DateRange;
}

// Utilitas untuk konversi tanggal
const formatDateToISOString = (
  date: Date | null | undefined
): string | undefined => {
  if (date instanceof Date && !isNaN(date.getTime())) {
    return date.toISOString();
  }
  return undefined;
};

const Queue = () => {
  const user = useAppSelector((state) => state.auth.user);
  const agencyId = user.id_instansi;
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    service: "",
    dateRange: {
      from: null,
      to: null,
    },
  });

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Fungsi update filter
  const updateFilters = useCallback((updates: Partial<FilterState>) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...updates,
    }));
  }, []);

  // Efek untuk update filter ketika search berubah
  useEffect(() => {
    updateFilters({ search: debouncedSearch });
  }, [debouncedSearch, updateFilters]);

  // Fungsi reset filter
  const resetFilters = useCallback(() => {
    setFilters({
      search: "",
      service: "",
      dateRange: {
        from: null,
        to: null,
      },
    });
    // Reset search term
    setSearchTerm("");
  }, []);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: DATA_PER_PAGE,
  });

  const {
    data,
    isFetching: isFetchingAll,
    isError,
    refetch,
  } = useGetQueueAgencyQuery({
    search: filters.search,
    service: filters.service,
    agency: agencyId,
    dateRange: {
      from: formatDateToISOString(filters.dateRange.from),
      to: formatDateToISOString(filters.dateRange.to),
    },
    page: paginationModel.page + 1,
    perPage: paginationModel.pageSize,
  });

  const isLoading = isFetchingAll;

  usePusherSubscription({
    channel: "queue-channel",
    event: "queue-updated",
    callback: (data) => {
      if (data.message === "queue-updated") {
        refetch();
      }
    },
  });

  if (isError) {
    return <ErrorDisplay callback={refetch} />;
  }

  const queues = data?.queues || [];
  const totalCount = data?.pagination.total || 0;

  const handlePaginationModelChange = (newModel: any) => {
    setPaginationModel(newModel);
  };

  const columns = [
    {
      field: "No.",
      headerName: "No.",
      width: 80,
      editable: false,
      sortable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "kode",
      headerName: "Kode",
      minWidth: 150,
      flex: 1,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        if (params.row.kode) {
          return <span className="font-bold">#{params.row.kode}</span>;
        } else {
          return <span>-</span>;
        }
      },
    },
    {
      field: "nama_lengkap",
      headerName: "Nama Pemohon",
      minWidth: 150,
      flex: 1,
      sortable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nama_layanan",
      headerName: "Layanan",
      minWidth: 150,
      flex: 1,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        const namaLayanan = params.row.nama_layanan;
        const namaInstansi = params.row.nama_instansi;

        return (
          <div className="flex flex-col items-center justify-center text-center w-full">
            <span
              className="text-sm font-medium leading-tight
              max-w-full truncate block"
              title={namaLayanan}
            >
              {namaLayanan}
            </span>
            <span
              className="text-xs text-gray-600 leading-tight
              max-w-full break-words overflow-hidden
              whitespace-normal line-clamp-2"
              title={namaInstansi}
            >
              {namaInstansi}
            </span>
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 1,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        return <ChangeStatus params={params} />;
      },
    },
    {
      field: "tanggal_waktu",
      headerName: "Tanggal/Waktu",
      minWidth: 150,
      flex: 1,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        const date = new Date(params.row.tanggal);
        const newDate = formattedDate(date);

        return (
          <div className="flex flex-col items-center justify-center text-center w-full">
            <span className="text-sm font-medium leading-tight">{newDate}</span>
            <span className="text-xs text-gray-600 leading-tight">
              Pkl {params.row.jam.slice(0, 5)}
            </span>
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      minWidth: 200,
      flex: 1,
      align: "center",
      headerAlign: "center",
      disableClickEventBubbling: true,
      renderCell: (params: any) => {
        return (
          <div className="flex space-x-2">
            <Link
              href={`/queues-agency/${params.row.id}`}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 my-4 gap-2"
            >
              <EditIcon size={18} />
              <p>Edit</p>
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="mx-auto pb-5 w-full">
        {/* HEADER BAR */}
        <div className="flex justify-between items-center mb-6">
          <Header name="Antrian" />
        </div>

        {/* Filter Komponen */}
        <QueueFilter
          filters={filters}
          updateFilters={updateFilters}
          onReset={resetFilters}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* BUTTON ADD & DOWNLOAD */}
        <div className="flex justify-end mb-4">
          <DownloadExcel filters={filters} />
        </div>

        <Datatable
          totalCount={totalCount}
          paginationModel={paginationModel}
          handlePaginationModelChange={handlePaginationModelChange}
          loading={isLoading || !queues}
          rows={
            (queues &&
              queues.map((item, index) => ({
                "No.":
                  paginationModel.page * paginationModel.pageSize + index + 1,
                ...item,
              }))) ||
            []
          }
          columns={columns}
        />
      </div>
    </>
  );
};

export default Queue;
