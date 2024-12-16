"use client";

import { BackButton } from "@/app/(components)/BackButton";
import { RenderFieldError } from "@/app/(components)/RenderFieldError";
import TiptapEditor from "@/app/(components)/TiptapEditor";
import { useCreateFacilityMutation } from "@/state/facilitySlice";
import { createMultipleImageValidation } from "@/utils/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

// Skema Validasi Zod
const formSchema = z.object({
  nama_fasilitas: z
    .string()
    .min(2, { message: "Nama fasilitas minimal 2 karakter" }),
  deskripsi: z.string().min(1, { message: "Deskripsi minimal 1 karakter" }),
  foto: createMultipleImageValidation(),
  aktif: z.boolean(),
});

// Definisi tipe berdasarkan skema
type FormData = z.infer<typeof formSchema>;

const AddFacility = () => {
  const router = useRouter();
  const [createFacility, { error: errorsAPI }] = useCreateFacilityMutation();
  const [previews, setPreviews] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      aktif: true,
      foto: [],
    },
  });

  // Watch foto untuk preview
  const fotoFiles = watch("foto");

  const handleFotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // Konversi FileList ke array
      const fileArray = Array.from(files);

      // Batasi jumlah foto
      const limitedFiles = fileArray.slice(0, 3);

      // Set value
      setValue("foto", limitedFiles);

      // Buat preview
      const newPreviews = limitedFiles.map((file) => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  };

  const onSubmit = async (formData: FormData) => {
    try {
      // Buat FormData untuk upload
      const submitData = new FormData();
      submitData.append("nama_fasilitas", formData.nama_fasilitas);
      submitData.append("deskripsi", formData.deskripsi);
      submitData.append("aktif", formData.aktif ? "1" : "0");

      // Tambahkan foto
      formData.foto.forEach((file, index) => {
        submitData.append(`foto[${index}]`, file);
      });

      // Kirim data
      await createFacility(submitData).unwrap();

      toast.success("Fasilitas berhasil ditambahkan");
      router.push("/facilities"); // Sesuaikan route
    } catch (error: any) {
      const errorMessage = error.data?.message || "Gagal menambah fasilitas";
      toast.error(errorMessage);
      console.error("Error detail:", error);
    }
  };

  // Fungsi untuk menghapus preview
  const removePreview = (indexToRemove: number) => {
    const newFiles = fotoFiles.filter((_, index) => index !== indexToRemove);
    setValue("foto", newFiles);

    const newPreviews = previews.filter((_, index) => index !== indexToRemove);
    setPreviews(newPreviews);
  };

  return (
    <>
      <BackButton />
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold">Tambah Fasilitas Baru</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nama Fasilitas */}
          <div>
            <label className="block mb-2 font-medium">
              Nama Fasilitas <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("nama_fasilitas")}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Masukkan nama fasilitas"
            />
            {errors.nama_fasilitas && (
              <p className="text-red-500 text-sm mt-1">
                {errors.nama_fasilitas.message}
              </p>
            )}
            {RenderFieldError("nama_fasilitas", errorsAPI)}
          </div>

          {/* Input Deskripsi dengan TiptapEditor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi Layanan <span className="text-red-500">*</span>
            </label>
            <Controller
              name="deskripsi"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TiptapEditor value={value as string} onChange={onChange} />
              )}
            />
            {errors.deskripsi && (
              <p className="text-red-500 text-sm mt-1">
                {errors.deskripsi.message}
              </p>
            )}
            {RenderFieldError("deskripsi", errorsAPI)}
          </div>

          {/* Upload Foto */}
          <div>
            <label className="block mb-2 font-medium">
              Foto Fasilitas <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFotoChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.foto && (
              <p className="text-red-500 text-sm mt-1">{errors.foto.message}</p>
            )}

            {/* Preview Foto */}
            {previews.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative aspect-square">
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="max-w-full max-h-full object-contain rounded"
                        style={{
                          objectFit: "contain",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removePreview(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 
          hover:bg-red-600 transition-colors z-10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status Aktif */}
          <div>
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                {...register("aktif")}
                className="mr-2 h-4 w-4 text-primary focus:ring-primary"
              />
              <span className="font-medium">Aktif</span>
            </label>
          </div>

          {/* Tombol Submit */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center bg-primary text-white font-semibold py-2 px-4 rounded 
            hover:bg-primary-dark transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              {isSubmitting ? "Menambahkan..." : "Tambah Fasilitas"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddFacility;
