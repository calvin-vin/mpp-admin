"use client";
import type { FormData } from "../../utils";

import { BackButton } from "@/app/(components)/BackButton";
import LoadingSpinner from "@/app/(components)/LoadingSpinner";
import { RenderFieldError } from "@/app/(components)/RenderFieldError";
import TiptapEditor from "@/app/(components)/TiptapEditor";
import {
  useDeletePhotoFacilityMutation,
  useGetSingleFacilityQuery,
  useUpdateFacilityMutation,
} from "@/state/facilitySlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { formSchema } from "../../utils";

const EditFacility = () => {
  const router = useRouter();
  const { id } = useParams();

  const { data: facilityData, isLoading: isLoadingFacility } =
    useGetSingleFacilityQuery({ id });

  const [updateFacility, { error: errorsAPI }] = useUpdateFacilityMutation();

  // State untuk preview foto
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingPhotos, setExistingPhotos] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
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

  useEffect(() => {
    if (facilityData?.data) {
      const facility = facilityData.data;

      // Reset form dengan data dari API
      reset({
        nama_fasilitas: facility.nama_fasilitas,
        deskripsi: facility.deskripsi,
        aktif: facility.aktif === "1" || facility.aktif === true,
      });

      // Set foto yang sudah ada
      if (facility.foto && facility.foto.length > 0) {
        setExistingPhotos(facility.foto);
      }
    }
  }, [facilityData, reset]);

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
      const submitData = new FormData();
      submitData.append("id_fasilitas", id as string);
      submitData.append("nama_fasilitas", formData.nama_fasilitas);
      submitData.append("deskripsi", formData.deskripsi);
      submitData.append("aktif", formData.aktif ? "1" : "0");

      // Tambahkan foto baru jika ada
      if (formData.foto && formData.foto.length > 0) {
        formData.foto.forEach((file, index) => {
          submitData.append(`foto[${index}]`, file);
        });
      }

      // Tambahkan informasi foto yang sudah ada untuk dipertahankan
      existingPhotos.forEach((photo, index) => {
        submitData.append(`existing_foto[${index}]`, photo);
      });

      // Kirim data
      await updateFacility(submitData).unwrap();

      toast.success("Fasilitas berhasil diperbarui");
      router.push("/facilities");
    } catch (error: any) {
      const errorMessage = error.data?.message || "Gagal memperbarui fasilitas";
      toast.error(errorMessage);
      console.error("Error detail:", error);
    }
  };

  // Fungsi untuk menghapus preview foto baru
  const removePreview = (indexToRemove: number) => {
    // Gunakan optional chaining dan provide default empty array
    const currentFiles = fotoFiles ?? [];

    const newFiles = currentFiles.filter((_, index) => index !== indexToRemove);
    setValue("foto", newFiles);

    const newPreviews = previews.filter((_, index) => index !== indexToRemove);
    setPreviews(newPreviews);
  };

  const [deletePhoto] = useDeletePhotoFacilityMutation();

  // Fungsi untuk menghapus foto yang sudah ada
  const removeExistingPhoto = async (indexToRemove: number) => {
    try {
      await deletePhoto({ id: indexToRemove }).unwrap();

      const newExistingPhotos = existingPhotos.filter((item: any) => {
        const id = item.foto.split("/").pop();
        return id !== indexToRemove;
      });
      setExistingPhotos(newExistingPhotos);

      toast.success("Berhasil menghapus data");
    } catch (err: any) {
      toast.error(err.data.message);
    }
  };

  if (isLoadingFacility) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <BackButton />
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold">Edit Fasilitas</h1>
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

          {/* Deskripsi TiptapEditor */}
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
            <label className="block mb-2 font-medium">Foto Fasilitas</label>
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

            {/* Preview Foto Existing */}
            {existingPhotos.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {existingPhotos.map((item: any, index) => {
                  const id = item.foto.split("/").pop();
                  return (
                    <div
                      key={`existing-${id}`}
                      className="relative aspect-square"
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <img
                          src={item.foto}
                          alt={`Existing Photo ${id + 1}`}
                          className="max-w-full max-h-full object-contain rounded"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExistingPhoto(id)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 
                        hover:bg-red-600 transition-colors z-10"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Preview Foto Baru */}
            {previews.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {previews.map((preview, index) => (
                  <div key={`new-${index}`} className="relative aspect-square">
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="max-w-full max-h-full object-contain rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removePreview(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 
                  hover:bg-red-600 transition-colors z-10"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
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
              {isSubmitting ? "Memperbarui..." : "Perbarui Fasilitas"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditFacility;
