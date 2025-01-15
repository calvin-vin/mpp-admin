"use client";

import TiptapEditor from "@/app/(components)/TiptapEditor";
import { useCreateServiceMutation } from "@/state/serviceSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircleIcon, XIcon } from "lucide-react";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const serviceSchema = z.object({
  layanan: z.string().min(1, { message: "Nama layanan harus diisi" }),
  deskripsi: z.string().optional(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface AddServiceModalProps {
  agencyId: string;
  isOpen: boolean;
  onClose: () => void;
}

const AddServiceModal: React.FC<AddServiceModalProps> = ({
  agencyId,
  isOpen,
  onClose,
}) => {
  const [createService, { isLoading }] = useCreateServiceMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      layanan: "",
      deskripsi: "",
    },
  });

  const onSubmit = async (data: ServiceFormData) => {
    try {
      const payload = {
        layanan: data.layanan,
        deskripsi: data.deskripsi || "",
        id_instansi: agencyId,
      };

      await createService(payload).unwrap();

      toast.success("Layanan berhasil ditambahkan");
      reset();
      onClose();
    } catch (error) {
      console.error("Gagal menambahkan layanan", error);
      toast.error("Gagal menambahkan layanan");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-xl mx-auto my-auto bg-white rounded-xl shadow-lg p-6">
        {/* Header Modal */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <PlusCircleIcon className="mr-2 text-primary" />
            Tambah Layanan Baru
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none transition"
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
                <TiptapEditor value={value as string} onChange={onChange} />
              )}
            />
          </div>

          {/* Tombol Submit */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-2 rounded-md 
              hover:bg-primary-hover transition duration-300
              disabled:opacity-50 disabled:cursor-not-allowed 
              flex items-center justify-center"
            >
              {isLoading ? (
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
                <PlusCircleIcon className="mr-2" />
              )}
              {isLoading ? "Menambahkan..." : "Tambah Layanan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddServiceModal;
