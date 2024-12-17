"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Download, SaveIcon } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { BackButton } from "@/app/(components)/BackButton";
import LoadingSpinner from "@/app/(components)/LoadingSpinner";
import { RenderFieldError } from "@/app/(components)/RenderFieldError";
import {
  useGetSingleRegulationQuery,
  useUpdateRegulationMutation,
} from "@/state/regulationSlice";
import { useRouter } from "next/navigation";
import { type RegulationFormData, regulationSchema } from "../../utils";

const EditRegulation: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();

  const { data: regulationData, isLoading: isLoadingFetch } =
    useGetSingleRegulationQuery({ id });

  const [updateRegulation, { isLoading: isLoadingUpdate, error: errorsAPI }] =
    useUpdateRegulationMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegulationFormData>({
    resolver: zodResolver(regulationSchema),
    defaultValues: {
      aktif: "1",
    },
  });

  // Populate form saat data dimuat
  useEffect(() => {
    if (regulationData?.data) {
      const regulation = regulationData.data;
      setValue("judul", regulation.judul);
      setValue("aktif", regulation.aktif);
    }
  }, [regulationData, setValue]);

  // Submit handler
  const onSubmit = async (data: RegulationFormData) => {
    try {
      const formData = new FormData();
      formData.append("id_regulasi", id as string);
      formData.append("judul", data.judul);

      if (data.file && data.file.length > 0) {
        formData.append("file", data.file[0]);
      }

      formData.append("aktif", data.aktif);

      await updateRegulation(formData).unwrap();

      toast.success("Regulasi berhasil diperbarui");
      router.push("/regulation");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal memperbarui regulasi");
    }
  };

  if (isLoadingFetch) {
    <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-8 rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-bold mb-6">Edit Regulasi</h1>

        {/* Judul */}
        <div>
          <label htmlFor="judul" className="block mb-2 font-medium">
            Judul Regulasi <span className="text-red-500">*</span>
          </label>
          <input
            {...register("judul")}
            className={`w-full p-2 border rounded ${
              errors.judul ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Masukkan judul regulasi"
          />
          {errors.judul && (
            <p className="text-red-500 text-sm mt-1">{errors.judul.message}</p>
          )}
          {RenderFieldError("judul", errorsAPI)}
        </div>

        {/* File Upload */}
        <div>
          <label htmlFor="file" className="block mb-2 font-medium">
            Unggah File Baru
          </label>
          <div className="flex items-center">
            <input
              type="file"
              {...register("file")}
              accept=".pdf,.doc,.docx"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          {errors.file && (
            <p className="text-red-500 text-sm mt-1">
              {errors.file.message as string}
            </p>
          )}
          {RenderFieldError("file", errorsAPI)}

          {/* Tampilkan file existing */}
          {regulationData?.data?.file_url && (
            <div className="mt-2 flex items-center">
              <a
                href={regulationData.data.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white rounded-full bg-gray-800 my-4 gap-2 hover:bg-gray-700"
              >
                <Download size={18} className="mr-2" />
                Unduh File
              </a>
            </div>
          )}
        </div>

        {/* Status Aktif */}
        <div>
          <label className="block mb-2 font-medium">Status</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="1"
                {...register("aktif")}
                className="form-radio"
              />
              <span className="ml-2">Aktif</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="0"
                {...register("aktif")}
                className="form-radio"
              />
              <span className="ml-2">Tidak Aktif</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoadingUpdate}
            className="w-full flex justify-center items-center bg-primary text-white font-semibold py-2 px-4 rounded 
            hover:bg-primary-dark transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SaveIcon className="w-5 h-5 mr-2" />
            {isLoadingUpdate ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRegulation;
