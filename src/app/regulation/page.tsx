"use client";

import Datatable from "@/app/(components)/Datatable";
import ErrorDisplay from "@/app/(components)/ErrorDisplay";
import ModalDelete from "@/app/(components)/ModalDelete";
import useDebounce from "@/hooks/useDebounce";
import {
  useDeleteRegulationMutation,
  useGetRegulationQuery,
} from "@/state/regulationSlice";
import { DATA_PER_PAGE } from "@/utils/constants";
import { EditIcon, FileIcon, PlusCircle, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";

const Regulation = () => {
  const [search, setSearch] = useState("");
  const debouncedSearchValue = useDebounce(search, 1000);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: DATA_PER_PAGE,
  });

  const {
    data,
    isFetching: isFetchingAll,
    isError,
    refetch,
  } = useGetRegulationQuery({
    search: debouncedSearchValue,
    page: paginationModel.page + 1,
    perPage: paginationModel.pageSize,
  });

  const [deleteRegulation, { isLoading: isLoadingDelete }] =
    useDeleteRegulationMutation();

  const isLoading = isFetchingAll || isLoadingDelete;

  const [showModalDelete, setShowModalDelete] = useState(false);
  const [dataIdToDelete, setDataIdToDelete] = useState<number | null>(null);

  // Transformasi data dengan id unik
  const transformedRows = useMemo(() => {
    return (data?.regulation || []).map((item, index) => ({
      id: item.id_regulasi,
      "No.": paginationModel.page * paginationModel.pageSize + index + 1,
      ...item,
    }));
  }, [data, paginationModel]);

  const handleShowModalDelete = useCallback((regulationId: number | null) => {
    setDataIdToDelete(regulationId);
    setShowModalDelete(true);
  }, []);

  const handleCloseModalDelete = useCallback(() => {
    setShowModalDelete(false);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    try {
      if (dataIdToDelete) {
        await deleteRegulation({ id: dataIdToDelete }).unwrap();
        toast.success("Berhasil menghapus data");
      }
    } catch (err) {
      toast.error("Gagal menghapus data");
    }

    handleCloseModalDelete();
  }, [dataIdToDelete, deleteRegulation, handleCloseModalDelete]);

  if (isError) {
    return <ErrorDisplay callback={refetch} />;
  }

  const totalCount = data?.pagination.total || 0;

  const columns = [
    {
      field: "No.",
      headerName: "No.",
      width: 80,
      align: "center",
      headerAlign: "center",
      editable: false,
      sortable: false,
    },
    {
      field: "judul",
      headerName: "Judul",
      minWidth: 150,
      flex: 1,
      sortable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "file_url",
      headerName: "File",
      minWidth: 100,
      flex: 1,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) =>
        params.row.file_url ? (
          <a
            href={params.row.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <FileIcon size={18} className="mr-2" />
            Lihat File
          </a>
        ) : (
          <span className="text-gray-400">Tidak ada file</span>
        ),
    },
    {
      field: "aktif",
      headerName: "Status",
      minWidth: 100,
      flex: 1,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        const isActive = params.row.aktif === "1";

        return (
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {isActive ? "Aktif" : "Tidak Aktif"}
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
              href={`/regulation/edit/${params.row.id_regulasi}`}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 my-4 gap-2"
            >
              <EditIcon size={18} />
              <p>Edit</p>
            </Link>
            <button
              onClick={() => handleShowModalDelete(params.row.id_regulasi)}
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
        {/* SEARCH INPUT */}
        <div className="mb-4 flex items-center">
          <input
            type="text"
            placeholder="Cari regulasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* BUTTON ADD */}
        <div className="flex justify-end mb-4">
          <Link
            href={`/regulation/add`}
            className={`flex items-center bg-primary text-white font-semibold py-2 px-4 rounded 
                hover:bg-primary-hover`}
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Tambah Instansi
          </Link>
        </div>

        <div style={{ width: "100%" }}>
          <Datatable
            totalCount={totalCount}
            paginationModel={paginationModel}
            handlePaginationModelChange={(newModel) =>
              setPaginationModel(newModel)
            }
            loading={isLoading || !data}
            rows={transformedRows}
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

export default Regulation;
