"use client";

import { BackButton } from "@/app/(components)/BackButton";
import ErrorDisplay from "@/app/(components)/ErrorDisplay";
import LoadingSpinner from "@/app/(components)/LoadingSpinner";
import ModalDelete from "@/app/(components)/ModalDelete";
import { useGetAgencyByIdQuery } from "@/state/agencySlice";
import { useDeleteServiceMutation } from "@/state/serviceSlice";
import {
  BriefcaseBusiness,
  Building,
  EditIcon,
  PlusCircleIcon,
  TrashIcon,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import AddServiceModal from "./AddServiceModal";
import EditServiceModal from "./EditServiceModal";

const AgencyPage = () => {
  const { id } = useParams();
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [serviceIdToDelete, setServiceIdToDelete] = useState<number | null>(
    null
  );

  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

  const {
    data: agency,
    isError,
    isLoading,
    refetch,
  } = useGetAgencyByIdQuery({ id });

  const handleShowModalDelete = (serviceId: number) => {
    setServiceIdToDelete(serviceId);
    setShowModalDelete(true);
  };

  const handleCloseModalDelete = () => setShowModalDelete(false);

  const handleConfirmDelete = async () => {
    if (!serviceIdToDelete) return;

    try {
      await deleteService({
        serviceId: serviceIdToDelete,
        agencyId: id as string,
      }).unwrap();

      toast.success("Layanan berhasil dihapus");
      handleCloseModalDelete();
    } catch (error) {
      toast.error("Gagal menghapus layanan");
      console.error(error);
    }
  };

  const [isEditServiceModalOpen, setIsEditServiceModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );

  const handleOpenEditServiceModal = (serviceId: number) => {
    setSelectedServiceId(serviceId);
    setIsEditServiceModalOpen(true);
  };

  const handleCloseEditServiceModal = () => {
    setSelectedServiceId(null);
    setIsEditServiceModalOpen(false);
  };

  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);

  const handleOpenAddServiceModal = () => {
    setIsAddServiceModalOpen(true);
  };

  const handleCloseAddServiceModal = () => {
    setIsAddServiceModalOpen(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !agency) {
    return <ErrorDisplay callback={refetch} />;
  }

  return (
    <>
      <div className="container mx-auto px-4 pb-24">
        <BackButton />
        {/* Header Instansi */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex items-center space-x-6">
            {agency?.data?.logo ? (
              <div className="relative">
                <Image
                  src={agency?.data?.logo}
                  alt={agency?.data?.instansi}
                  width={120}
                  height={120}
                  className="transform transition-transform duration-300 hover:scale-105"
                />
              </div>
            ) : (
              <div
                className="w-[120px] h-[120px] bg-primary/10 rounded-full 
        flex items-center justify-center"
              >
                <Building className="h-12 w-12 text-primary/50" />
              </div>
            )}

            <div className="flex-grow">
              <h2
                className="text-4xl font-extrabold
      bg-clip-text text-primary bg-gradient-to-r from-primary to-primary-dark 
      mb-2 leading-tight"
              >
                {agency?.data?.instansi}
              </h2>
              <div className="flex items-center space-x-3">
                <div
                  className="inline-flex items-center bg-gray-100 
          px-3 py-1 rounded-full text-sm text-gray-600"
                >
                  <BriefcaseBusiness className="h-4 w-4 mr-2 text-primary" />
                  Nomor Tenant: {agency?.data?.no_tenant}
                </div>
                {agency?.data?.aktif == "0" ? (
                  <div
                    className="inline-flex items-center bg-red-50 
          px-3 py-1 rounded-full text-sm text-red-700"
                  >
                    <span className="mr-2">●</span>
                    Tidak aktif
                  </div>
                ) : (
                  <div
                    className="inline-flex items-center bg-green-50 
          px-3 py-1 rounded-full text-sm text-green-700"
                  >
                    <span className="mr-2">●</span>
                    Aktif
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Statistik Instansi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            {
              icon: "/assets/logo/services_count_logo.png",
              value: agency?.data?.service?.length,
              label: "Jumlah Layanan",
            },
            {
              icon: "/assets/logo/officers_count_logo.png",
              value: agency?.data?.jumlah_petugas,
              label: "Jumlah Petugas",
            },
            {
              icon: "/assets/logo/visitors_count_logo.png",
              value: agency?.data?.visitors_count || 0,
              label: "Total Kunjungan",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg shadow-md bg-white flex items-center"
            >
              <Image
                src={stat.icon}
                alt={stat.label}
                width={50}
                height={50}
                className="mr-4"
              />
              <div>
                <h4 className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </h4>
                <p className="text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Daftar Layanan */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold">Daftar Layanan</h3>
            <button
              className="flex items-center bg-primary text-white py-2 px-4 rounded hover:bg-primary-hover"
              onClick={handleOpenAddServiceModal}
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              Tambah Layanan
            </button>
          </div>

          {agency?.data?.service?.length === 0 ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto mb-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Belum Ada Layanan
              </h3>
              <p className="text-gray-500">
                Tambahkan layanan pertama untuk memulai
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {agency?.data?.service?.map((service: any) => (
                <div
                  key={service.id_layanan}
                  className="group bg-white border border-gray-200 rounded-xl 
        shadow-sm hover:shadow-md transition-all duration-300 
        overflow-hidden"
                >
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex-grow">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary transition">
                          {service.layanan}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                        onClick={() =>
                          handleOpenEditServiceModal(service.id_layanan)
                        }
                        title="Edit Layanan"
                      >
                        <EditIcon className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 rounded-full bg-red-50 text-red-600 
              hover:bg-red-100 focus:outline-none focus:ring-2 
              focus:ring-red-500/50 transition"
                        onClick={() =>
                          handleShowModalDelete(service.id_layanan)
                        }
                        title="Hapus Layanan"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddServiceModal
        agencyId={String(id)}
        isOpen={isAddServiceModalOpen}
        onClose={handleCloseAddServiceModal}
      />

      <ModalDelete
        show={showModalDelete}
        handleClose={handleCloseModalDelete}
        handleConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />

      {selectedServiceId && (
        <EditServiceModal
          serviceId={selectedServiceId}
          agencyId={String(id)}
          isOpen={isEditServiceModalOpen}
          onClose={handleCloseEditServiceModal}
        />
      )}
    </>
  );
};

export default AgencyPage;
