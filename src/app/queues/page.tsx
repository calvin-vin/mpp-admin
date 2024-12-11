"use client";

import type { Queue } from "@/state/queueSlice";

import Header from "@/app/(components)/Header";
import useDebounce from "@/hooks/useDebounce";
import { usePusherSubscription } from "@/hooks/usePusherSubscription";
import { useDeleteQueueMutation, useGetQueuesQuery } from "@/state/queueSlice";
import { DATA_PER_PAGE } from "@/utils/constants";
import {
  CircleCheck,
  EditIcon,
  LoaderCircleIcon,
  PlusCircle,
  TrashIcon,
} from "lucide-react";
import { useCallback, useState } from "react";
import Datatable from "../(components)/Datatable";
import ErrorDisplay from "../(components)/ErrorDisplay";
import QueueFilter from "./QueueFilter";
import { formattedDate, formattedTime } from "@/utils/helpers";
import ModalDelete from "@/app/(components)/ModalDelete";
import toast from "react-hot-toast";
import Link from "next/link";

// Definisikan tipe DateRange dan FilterState seperti di QueueFilter
interface DateRange {
  from?: Date | null;
  to?: Date | null;
}

interface FilterState {
  search: string;
  status: string;
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
  // State untuk filter
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "",
    service: "",
    dateRange: {
      from: null,
      to: null,
    },
  });

  // Fungsi update filter
  const updateFilters = useCallback((updates: Partial<FilterState>) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...updates,
    }));
  }, []);

  // Fungsi reset filter
  const resetFilters = useCallback(() => {
    setFilters({
      search: "",
      status: "",
      service: "",
      dateRange: {
        from: null,
        to: null,
      },
    });
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
  } = useGetQueuesQuery({
    search: filters.search,
    status: filters.status,
    service: filters.service,
    dateRange: {
      from: formatDateToISOString(filters.dateRange.from),
      to: formatDateToISOString(filters.dateRange.to),
    },
    page: paginationModel.page + 1,
    perPage: paginationModel.pageSize,
  });

  const [deleteQueue, { isLoading: isLoadingDelete }] =
    useDeleteQueueMutation();

  const isLoading = isFetchingAll || isLoadingDelete;

  usePusherSubscription({
    channel: "queue-channel",
    event: "queue-updated",
    callback: (data) => {
      if (data.message === "queue-updated") {
        refetch();
      }
    },
  });

  const [showModalDelete, setShowModalDelete] = useState(false);
  const [dataIdToDelete, setDataIdToDelete] = useState<number | null>(null);

  const handleShowModalDelete = (serviceId: number | null) => {
    setDataIdToDelete(serviceId);
    setShowModalDelete(true);
  };

  const handleCloseModalDelete = () => setShowModalDelete(false);
  const handleConfirmDelete = async () => {
    try {
      await deleteQueue({ id: dataIdToDelete }).unwrap();
      toast.success("Berhasil menghapus data");
    } catch (err) {
      toast.error("Gagal menghapus data");
    }

    handleCloseModalDelete();
  };

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
        return <span className="font-bold">#{params.row.kode}</span>;
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
      field: "layanan",
      headerName: "Layanan",
      minWidth: 150,
      flex: 1,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        return params.row.nama_lengkap;
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
        const isAttend = params.row.hadir == 1;
        if (isAttend) {
          return (
            <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white rounded-full bg-green-700 my-4 gap-2">
              <CircleCheck size={18} />
              <p>Selesai</p>
            </span>
          );
        } else {
          return (
            <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white rounded-full bg-yellow-700 my-4 gap-2">
              <LoaderCircleIcon size={18} />
              <p>Dalam Proses</p>
            </span>
          );
        }
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
              href={`/queues/${params.row.id}`}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 my-4 gap-2"
            >
              <EditIcon size={18} />
              <p>Edit</p>
            </Link>
            <button
              onClick={() => handleShowModalDelete(params.row.id)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white rounded-lg bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 my-4 gap-2"
            >
              <TrashIcon size={18} />
              <p>Hapus</p>
            </button>
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
        />

        {/* BUTTON ADD */}
        <div className="flex justify-end mb-4">
          <Link
            href={`/queues/add`}
            className={`flex items-center bg-primary text-white font-semibold py-2 px-4 rounded 
                hover:bg-primary-hover`}
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Tambah Antrian
          </Link>
        </div>

        <div style={{ width: "100%" }}>
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
      </div>

      <ModalDelete
        show={showModalDelete}
        handleClose={handleCloseModalDelete}
        handleConfirm={handleConfirmDelete}
        isLoading={isLoadingDelete}
      />
    </>
  );
};

export default Queue;
