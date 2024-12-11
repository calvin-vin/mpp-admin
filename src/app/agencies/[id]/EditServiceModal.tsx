"use client";

import LoadingSpinner from "@/app/(components)/LoadingSpinner";
import TiptapEditor from "@/app/(components)/TiptapEditor";
import {
  useGetServiceByIdQuery,
  useUpdateServiceMutation,
} from "@/state/serviceSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditIcon, XIcon } from "lucide-react";
import React, { useEffect, useState } from "react"; // Tambahkan useState
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

// Skema validasi Zod untuk edit layanan
const editServiceSchema = z.object({
  layanan: z.string().min(2, { message: "Nama layanan minimal 2 karakter" }),
  deskripsi: z.string().optional(),
});

type EditServiceFormData = z.infer<typeof editServiceSchema>;

interface EditServiceModalProps {
  serviceId: number;
  agencyId: string;
  isOpen: boolean;
  onClose: () => void;
}

const EditServiceModal: React.FC<EditServiceModalProps> = ({
  serviceId,
  agencyId,
  isOpen,
  onClose,
}) => {
  // Tambahkan state untuk deskripsi
  const [deskripsi, setDeskripsi] = useState<string>("");

  // Query untuk mendapatkan detail layanan
  const { data: serviceData, isLoading: isLoadingService } =
    useGetServiceByIdQuery({
      serviceId,
    });

  // Mutation untuk update layanan
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<EditServiceFormData>({
    resolver: zodResolver(editServiceSchema),
    defaultValues: {
      layanan: "",
      deskripsi: "",
    },
  });

  // Populate form dengan data layanan saat modal terbuka
  useEffect(() => {
    if (serviceData?.data && isOpen) {
      const serviceDeskripsi = serviceData.data.deskripsi || "";

      // Set deskripsi ke state
      setDeskripsi(serviceDeskripsi);

      reset({
        layanan: serviceData.data.layanan,
        deskripsi: serviceDeskripsi,
      });
    }
  }, [serviceData, isOpen, reset]);

  const onSubmit = async (data: EditServiceFormData) => {
    try {
      const payload = {
        id: serviceId,
        layanan: data.layanan,
        deskripsi: data.deskripsi || "",
        id_instansi: agencyId,
      };

      await updateService(payload).unwrap();

      toast.success("Layanan berhasil diperbarui");
      onClose(); // Tutup modal
    } catch (error) {
      console.error("Gagal memperbarui layanan", error);
      toast.error("Gagal memperbarui layanan");
    }
  };

  if (!isOpen) return null;

  // Loading state saat mengambil data layanan
  if (isLoadingService) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="relative w-full max-w-md mx-auto my-auto 
        bg-white rounded-xl shadow-lg p-6"
      >
        {/* Header Modal */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <EditIcon className="mr-2 text-primary" />
            Edit Layanan
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 
            focus:outline-none transition"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Input Nama Layanan */}
          <div>
            <label
              htmlFor="layanan"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nama Layanan
            </label>
            <input
              type="text"
              id="layanan"
              {...register("layanan")}
              className={`w-full px-3 py-2 border rounded-md 
              focus:outline-none focus:ring-2 focus:ring-primary/50
              ${errors.layanan ? "border-red-500" : "border-gray-300"}`}
              placeholder="Masukkan nama layanan"
            />
            {errors.layanan && (
              <p className="text-red-500 text-sm mt-1">
                {errors.layanan.message}
              </p>
            )}
          </div>

          {/* Input Deskripsi dengan TiptapEditor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi Layanan
            </label>
            <Controller
              name="deskripsi"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TiptapEditor
                  value={deskripsi} // Gunakan state deskripsi
                  onChange={(newValue) => {
                    setDeskripsi(newValue); // Update state
                    onChange(newValue); // Update form value
                  }}
                />
              )}
            />
          </div>

          {/* Tombol Submit */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={isUpdating}
              className="w-full bg-primary text-white py-2 rounded-md 
              hover:bg-primary-hover transition duration-300
              disabled:opacity-50 disabled:cursor-not-allowed 
              flex items-center justify-center"
            >
              {isUpdating ? (
                <div className="animate-spin mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="w-5 h-5 text-white"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              ) : (
                <EditIcon className="mr-2" />
              )}
              {isUpdating ? "Memperbarui..." : "Perbarui Layanan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditServiceModal;
