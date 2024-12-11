"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

import { BackButton } from "@/app/(components)/BackButton";
import { RenderFieldError } from "@/app/(components)/RenderFieldError";
import { useCreateRegulationMutation } from "@/state/regulationSlice";

// Skema Validasi Zod
const regulationSchema = z.object({
  judul: z.string().min(3, { message: "Judul minimal 3 karakter" }),
  file: z
    .any()
    .refine(
      (files) => !files || (files instanceof FileList && files.length > 0),
      {
        message: "File harus dipilih",
      }
    ),
  aktif: z.enum(["0", "1"]).default("1"),
});

type RegulationFormData = z.infer<typeof regulationSchema>;

const AddRegulation: React.FC = () => {
  const router = useRouter();
  const [createRegulation, { isLoading, error: errorsAPI }] =
    useCreateRegulationMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegulationFormData>({
    resolver: zodResolver(regulationSchema),
    defaultValues: {
      aktif: "1",
    },
  });

  // Submit handler
  const onSubmit = async (data: RegulationFormData) => {
    try {
      const formData = new FormData();
      formData.append("judul", data.judul);

      if (data.file && data.file.length > 0) {
        formData.append("file", data.file[0]);
      }

      formData.append("aktif", data.aktif);

      await createRegulation(formData).unwrap();

      toast.success("Regulasi berhasil ditambahkan");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal menambahkan regulasi");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-8 rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-bold mb-6">Tambah Regulasi Baru</h1>

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
            Unggah File <span className="text-red-500">*</span>
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
            disabled={isLoading}
            className="w-full flex justify-center items-center bg-primary text-white font-semibold py-2 px-4 rounded 
            hover:bg-primary-dark transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            {isLoading ? "Menambahkan..." : "Tambah"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRegulation;
