"use client";

import useDebounce from "@/hooks/useDebounce";
import {
  Agency,
  useDeleteAgencyMutation,
  useGetAgenciesQuery,
} from "@/state/agencySlice";
import {
  EditIcon,
  EyeIcon,
  PlusCircle,
  SearchIcon,
  Trash2Icon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import ModalDelete from "../(components)/ModalDelete";
import ErrorDisplay from "../(components)/ErrorDisplay";
import LoadingSpinner from "../(components)/LoadingSpinner";

const AgencyPage = () => {
  const [search, setSearch] = useState("");
  const debouncedSearchValue = useDebounce(search, 500);

  const {
    data: agenciesData,
    isFetching: isLoading,
    isError,
    refetch,
  } = useGetAgenciesQuery({
    search: debouncedSearchValue,
  });

  const [deleteAgency, { isLoading: isLoadingDelete }] =
    useDeleteAgencyMutation();

  const [showModalDelete, setShowModalDelete] = useState(false);
  const [dataIdToDelete, setDataIdToDelete] = useState<number | null>(null);

  const handleShowModalDelete = (serviceId: number | null) => {
    setDataIdToDelete(serviceId);
    setShowModalDelete(true);
  };

  const handleCloseModalDelete = () => setShowModalDelete(false);
  const handleConfirmDelete = async () => {
    try {
      await deleteAgency({ id: dataIdToDelete }).unwrap();
      toast.success("Berhasil menghapus data");
    } catch (err: any) {
      toast.error(err.data.message);
    }

    handleCloseModalDelete();
  };

  if (isError) {
    return <ErrorDisplay callback={refetch} />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 pb-5">
      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
          <SearchIcon className="w-5 h-5 text-gray-500 ml-3" />
          <input
            className="w-full py-2 px-3 focus:outline-none"
            placeholder="Cari instansi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* BUTTON ADD */}
      <div className="flex justify-end mb-4">
        <Link
          href={`/agencies/add`}
          className={`flex items-center bg-primary text-white font-semibold py-2 px-4 rounded 
                hover:bg-primary-hover`}
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Tambah Instansi
        </Link>
      </div>
      {/* AGENCY LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {agenciesData?.agencies.map((agency: Agency) => (
          <div
            key={agency.id_instansi}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center transform transition-all hover:scale-105 relative group"
          >
            {/* Status dari Instansi */}
            <div className="absolute top-2 left-2 flex">
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  agency.aktif == "1"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {agency.aktif == "1" ? "Aktif" : "Tidak Aktif"}
              </span>
            </div>

            {/* Tombol Edit & Delete dengan efek hover */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex">
              <Link
                href={`/agencies/edit/${agency.id_instansi}`}
                className="text-green-500 hover:text-green-700 bg-white/80 rounded-full p-1 shadow-sm"
                aria-label={`Edit ${agency.instansi}`}
              >
                <EditIcon className="w-4 h-4" strokeWidth={1.5} />
              </Link>

              <button
                onClick={() => handleShowModalDelete(agency.id_instansi)}
                className="text-red-500 hover:text-red-700 bg-white/80 rounded-full p-1 shadow-sm"
                aria-label={`Delete ${agency.instansi}`}
              >
                <Trash2Icon className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>

            {/* Logo Agency */}
            {agency.logo ? (
              <div className="w-24 h-24 mb-6 flex items-center justify-center">
                <img
                  src={agency.logo}
                  alt={`Logo ${agency.instansi}`}
                  width={96}
                  height={96}
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="w-24 h-24 mb-4 flex items-center justify-center bg-gray-100 rounded-full">
                <span className="text-gray-500">No Logo</span>
              </div>
            )}

            <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
              {agency.instansi}
            </h3>

            <div className="mt-auto w-full">
              <div className="flex items-center justify-center mb-3 w-full">
                <div className="bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700">
                  <span className="font-medium">Kode:</span> {agency.kode}
                </div>
              </div>

              <div className="flex items-center justify-center mb-3 text-sm text-gray-600">
                Jumlah Petugas: {agency.jumlah_petugas}
              </div>

              <Link
                href={`/agencies/${agency.id_instansi}`}
                className="w-full flex items-center justify-center bg-primary/10 text-primary hover:bg-primary/20 font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                <EyeIcon className="w-5 h-5 mr-2" />
                Lihat Detail
              </Link>
            </div>
          </div>
        ))}
      </div>

      <ModalDelete
        show={showModalDelete}
        handleClose={handleCloseModalDelete}
        handleConfirm={handleConfirmDelete}
        isLoading={isLoadingDelete}
      />

      {/* Tampilkan pesan jika tidak ada data */}
      {!isLoading && agenciesData?.agencies.length === 0 && (
        <div className="text-center text-gray-500 py-10">
          Tidak ada instansi ditemukan
        </div>
      )}
    </div>
  );
};

export default AgencyPage;
