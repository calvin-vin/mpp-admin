"use client";

import Header from "@/app/(components)/Header";
import ModalDelete from "@/app/(components)/ModalDelete";
import useDebounce from "@/hooks/useDebounce";
import { useDeleteUserMutation, useGetUsersQuery } from "@/state/userSlice";
import { DATA_PER_PAGE } from "@/utils/constants";
import {
  CircleCheck,
  EditIcon,
  LoaderCircleIcon,
  PlusCircle,
  SearchIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import Datatable from "../(components)/Datatable";
import ErrorDisplay from "../(components)/ErrorDisplay";

const User = () => {
  const [search, setSearch] = useState("");
  const debouncedSearchValue = useDebounce(search, 500);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: DATA_PER_PAGE,
  });

  const {
    data,
    isFetching: isFetchingAll,
    isError,
    refetch,
  } = useGetUsersQuery({
    search: debouncedSearchValue,
    page: paginationModel.page + 1,
    perPage: paginationModel.pageSize,
  });

  const [deleteUser, { isLoading: isLoadingDelete }] = useDeleteUserMutation();

  const isLoading = isFetchingAll || isLoadingDelete;

  const [showModalDelete, setShowModalDelete] = useState(false);
  const [dataIdToDelete, setDataIdToDelete] = useState<number | null>(null);

  const handleShowModalDelete = (serviceId: number | null) => {
    setDataIdToDelete(serviceId);
    setShowModalDelete(true);
  };

  const handleCloseModalDelete = () => setShowModalDelete(false);
  const handleConfirmDelete = async () => {
    try {
      await deleteUser({ id: dataIdToDelete }).unwrap();
      toast.success("Berhasil menghapus data");
    } catch (err) {
      toast.error("Gagal menghapus data");
    }

    handleCloseModalDelete();
  };

  if (isError) {
    return <ErrorDisplay callback={refetch} />;
  }

  const users = data?.users || [];
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
      field: "nama_lengkap",
      headerName: "Nama Pengguna",
      minWidth: 150,
      flex: 1,
      sortable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nama_instansi",
      headerName: "Instansi",
      minWidth: 150,
      flex: 1,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        const namaInstansi = params.row.nama_instansi;

        return (
          <div className="flex flex-col items-center justify-center text-center w-full">
            <span
              className="text-gray-600 leading-tight 
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
      field: "mobile",
      headerName: "NO HP",
      minWidth: 150,
      flex: 1,
      sortable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "role_name",
      headerName: "Role",
      minWidth: 150,
      flex: 1,
      sortable: false,
      align: "center",
      headerAlign: "center",
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
        const isActive = params.row.status == "ACTIVE";
        if (isActive) {
          return (
            <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white rounded-full bg-green-700 my-4 gap-2">
              <CircleCheck size={18} />
              <p>Aktif</p>
            </span>
          );
        } else {
          return (
            <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white rounded-full bg-yellow-700 my-4 gap-2">
              <LoaderCircleIcon size={18} />
              <p>Tidak Aktif</p>
            </span>
          );
        }
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
              href={`/users/edit/${params.row.id}`}
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
          <Header name="Pengguna" />
        </div>

        {/* SEARCH BAR */}
        <div className="mb-6">
          <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
            <SearchIcon className="w-5 h-5 text-gray-500 ml-3" />
            <input
              className="w-full py-2 px-3 focus:outline-none"
              placeholder="Cari pengguna..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* BUTTON ADD */}
        <div className="flex justify-end mb-4">
          <Link
            href={`/users/add`}
            className={`flex items-center bg-primary text-white font-semibold py-2 px-4 rounded 
                hover:bg-primary-hover`}
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Tambah Pengguna
          </Link>
        </div>

        <div style={{ width: "100%" }}>
          <Datatable
            totalCount={totalCount}
            paginationModel={paginationModel}
            handlePaginationModelChange={handlePaginationModelChange}
            loading={isLoading || !users}
            rows={
              (users &&
                users.map((item, index) => ({
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

export default User;
