"use client";

import { BackButton } from "@/app/(components)/BackButton";
import LoadingSpinner from "@/app/(components)/LoadingSpinner";
import { RenderFieldError } from "@/app/(components)/RenderFieldError";
import {
  useGetAgencyByIdQuery,
  useUpdateAgencyMutation,
} from "@/state/agencySlice";
import { createImageValidation } from "@/utils/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

// Skema Validasi Zod (sama dengan AddAgency)
const formSchema = z.object({
  instansi: z.string().min(2, { message: "Nama instansi minimal 2 karakter" }),
  kode: z.string().min(2, { message: "Kode instansi minimal 2 karakter" }),
  no_tenant: z.preprocess(
    (val) => String(val),
    z.string().min(1, { message: "Nomor tenant harus diisi" })
  ),
  jumlah_petugas: z.coerce
    .number()
    .min(1, { message: "Jumlah petugas harus lebih dari 0" }),
  aktif: z.boolean(),
  logo: createImageValidation(),
});

// Definisi tipe berdasarkan skema
type FormData = z.infer<typeof formSchema>;

const EditAgency = () => {
  const router = useRouter();
  const { id } = useParams();

  // Query untuk mendapatkan data agency
  const { data: agencyData, isLoading: isLoadingAgency } =
    useGetAgencyByIdQuery({ id });

  // Mutation untuk update agency
  const [updateAgency, { error: errorsAPI }] = useUpdateAgencyMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // Preview logo
  const logoFile = watch("logo");

  // Versi paling sederhana dan efisien
  useEffect(() => {
    if (agencyData?.data) {
      reset({
        instansi: agencyData.data.instansi,
        kode: agencyData.data.kode,
        no_tenant: agencyData.data.no_tenant,
        jumlah_petugas: parseInt(agencyData.data.jumlah_petugas),
        aktif: agencyData.data.aktif === "1" || agencyData.data.aktif === true,
      });
    }
  }, [agencyData, reset]);

  // Handler Logo Change dengan validasi
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("logo", file);
    }
  };

  // Submit handler dengan error handling yang lebih baik
  const onSubmit = async (formData: FormData) => {
    try {
      const submitData = new FormData();

      Object.entries({
        id_instansi: String(id),
        instansi: formData.instansi,
        kode: formData.kode,
        no_tenant: formData.no_tenant,
        jumlah_petugas: formData.jumlah_petugas.toString(),
        aktif: formData.aktif ? "1" : "0",
      }).forEach(([key, value]) => submitData.append(key, value));

      if (formData.logo) {
        submitData.append("logo", formData.logo);
      }

      await updateAgency(submitData).unwrap();

      toast.success("Instansi berhasil diperbarui");
      router.push("/agencies");
    } catch (error: any) {
      const errorMessage = error.data?.message || "Gagal memperbarui instansi";

      toast.error(errorMessage);
      console.error("Error detail:", error);
    }
  };

  // Loading state
  if (isLoadingAgency) {
    return <LoadingSpinner />;
  }

  const handleKodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.value = event.target.value.toUpperCase();
  };

  return (
    <>
      <BackButton />
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold">Edit Instansi</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nama Instansi */}
          <div>
            <label className="block mb-2 font-medium">Nama Instansi</label>
            <input
              type="text"
              {...register("instansi")}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Masukkan nama instansi"
            />
            {errors.instansi && (
              <p className="text-red-500 text-sm mt-1">
                {errors.instansi.message}
              </p>
            )}
            {RenderFieldError("instansi", errorsAPI)}
          </div>

          {/* Kode Instansi */}
          <div>
            <label className="block mb-2 font-medium">
              Kode Instansi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("kode")}
              onChange={(e) => {
                // Pastikan panggil method register asli
                register("kode").onChange(e);
                handleKodeChange(e);
              }}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Masukkan kode instansi"
            />
            {errors.kode && (
              <p className="text-red-500 text-sm mt-1">{errors.kode.message}</p>
            )}
            {RenderFieldError("kode", errorsAPI)}
          </div>

          {/* Nomor Tenant */}
          <div>
            <label className="block mb-2 font-medium">Nomor Tenant</label>
            <input
              type="text"
              {...register("no_tenant")}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Masukkan nomor tenant"
            />
            {errors.no_tenant && (
              <p className="text-red-500 text-sm mt-1">
                {errors.no_tenant.message}
              </p>
            )}
            {RenderFieldError("no_tenant", errorsAPI)}
          </div>

          {/* Jumlah Petugas */}
          <div>
            <label className="block mb-2 font-medium">Jumlah Petugas</label>
            <input
              type="number"
              {...register("jumlah_petugas")}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Masukkan jumlah petugas"
            />
            {errors.jumlah_petugas && (
              <p className="text-red-500 text-sm mt-1">
                {errors.jumlah_petugas.message}
              </p>
            )}
            {RenderFieldError("jumlah_petugas", errorsAPI)}
          </div>

          {/* Upload Logo */}
          <div>
            <label className="block mb-2 font-medium">Logo Instansi</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {/* Tampilkan logo lama jika ada */}
            {agencyData?.data?.logo && !logoFile && (
              <div className="mt-2">
                <Image
                  src={agencyData.data.logo}
                  alt="Logo Instansi"
                  width={200}
                  height={200}
                  className="max-w-[200px] max-h-[200px] object-contain"
                />
              </div>
            )}

            {/* Preview logo baru jika dipilih */}
            {logoFile && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(logoFile)}
                  alt="Logo Preview"
                  className="max-w-[200px] max-h-[200px] object-contain"
                />
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
              <Save className="w-5 h-5 mr-2" />
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditAgency;
