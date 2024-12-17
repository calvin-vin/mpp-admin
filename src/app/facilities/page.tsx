"use client";

import useDebounce from "@/hooks/useDebounce";
import {
  Facility,
  useDeleteFacilityMutation,
  useGetFacilitiesQuery,
} from "@/state/facilitySlice";
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
import ErrorDisplay from "../(components)/ErrorDisplay";
import ModalDelete from "../(components)/ModalDelete";

const FacilityPage = () => {
  const [search, setSearch] = useState("");
  const debouncedSearchValue = useDebounce(search, 500);

  const {
    data: facilities,
    isFetching: isLoading,
    isError,
    refetch,
  } = useGetFacilitiesQuery({
    page: 1,
    perPage: 999,
    search: debouncedSearchValue,
  });

  const [deleteFacility, { isLoading: isLoadingDelete }] =
    useDeleteFacilityMutation();

  const [showModalDelete, setShowModalDelete] = useState(false);
  const [dataIdToDelete, setDataIdToDelete] = useState<number | null>(null);

  const handleShowModalDelete = (serviceId: number | null) => {
    setDataIdToDelete(serviceId);
    setShowModalDelete(true);
  };

  const handleCloseModalDelete = () => setShowModalDelete(false);
  const handleConfirmDelete = async () => {
    try {
      await deleteFacility({ id: dataIdToDelete }).unwrap();
      toast.success("Berhasil menghapus data");
    } catch (err: any) {
      toast.error(err.data.message);
    }

    handleCloseModalDelete();
  };

  if (isError) {
    <ErrorDisplay callback={refetch} />;
  }

  return (
    <div className="container mx-auto px-4 pb-5">
      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
          <SearchIcon className="w-5 h-5 text-gray-500 ml-3" />
          <input
            className="w-full py-2 px-3 focus:outline-none"
            placeholder="Cari fasilitas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* BUTTON ADD */}
      <div className="flex justify-end mb-4">
        <Link
          href={`/facilities/add`}
          className={`flex items-center bg-primary text-white font-semibold py-2 px-4 rounded 
                hover:bg-primary-hover`}
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Tambah Fasilitas
        </Link>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities?.facilities.map((facility: Facility) => (
            <div
              key={facility.id_fasilitas}
              className="bg-white rounded-lg shadow-md flex flex-col relative group"
            >
              {/* Absolute positioned edit/delete buttons */}
              <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex">
                <Link
                  href={`/facilities/edit/${facility.id_fasilitas}`}
                  className="text-green-500 hover:text-green-700 bg-white/80 rounded-full p-1 shadow-sm"
                  aria-label={`Edit ${facility.nama_fasilitas}`}
                >
                  <EditIcon className="w-4 h-4" strokeWidth={1.5} />
                </Link>

                <button
                  onClick={() => handleShowModalDelete(facility.id_fasilitas)}
                  className="text-red-500 hover:text-red-700 bg-white/80 rounded-full p-1 shadow-sm ml-1"
                  aria-label={`Delete ${facility.nama_fasilitas}`}
                >
                  <Trash2Icon className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>

              {/* Image wrapper with fixed height */}
              <div className="w-full h-48 relative overflow-hidden">
                {facility.foto ? (
                  <Image
                    src={facility.foto}
                    alt={`Logo ${facility.nama_fasilitas}`}
                    fill
                    className="object-cover w-full h-full"
                    priority={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-gray-500">No Logo</span>
                  </div>
                )}
              </div>

              {/* Content section */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                  {facility.nama_fasilitas}
                </h3>

                <div className="flex justify-center mb-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      facility.aktif == "1"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {facility.aktif == "1" ? "Aktif" : "Tidak Aktif"}
                  </span>
                </div>

                <div className="mt-auto">
                  <Link
                    href={`/facilities/edit/${facility.id_fasilitas}`}
                    className="w-full flex items-center justify-center bg-primary/10 text-primary hover:bg-primary/20 font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    <EyeIcon className="w-5 h-5 mr-2" />
                    Lihat Detail
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ModalDelete
        show={showModalDelete}
        handleClose={handleCloseModalDelete}
        handleConfirm={handleConfirmDelete}
        isLoading={isLoadingDelete}
      />

      {/* Tampilkan pesan jika tidak ada data */}
      {!isLoading && facilities?.facilities.length === 0 && (
        <div className="text-center text-gray-500 py-10">
          Tidak ada fasilitas ditemukan
        </div>
      )}
    </div>
  );
};

export default FacilityPage;
