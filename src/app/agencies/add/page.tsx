"use client";

import { BackButton } from "@/app/(components)/BackButton";
import { RenderFieldError } from "@/app/(components)/RenderFieldError";
import { useCreateAgencyMutation } from "@/state/agencySlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Controller, useForm } from "react-hook-form";

import toast from "react-hot-toast";
import { type FormData, formSchema } from "../utils";
import TiptapEditor from "@/app/(components)/TiptapEditor";

const AddAgency = () => {
  const router = useRouter();
  const [createAgency, { error: errorsAPI }] = useCreateAgencyMutation();

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
    },
  });

  // Preview logo
  const logoFile = watch("logo");

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("logo", file);
    }
  };

  const onSubmit = async (formData: FormData) => {
    try {
      const submitData = new FormData();
      submitData.append("instansi", formData.instansi);
      submitData.append("nickname", formData.nickname);
      submitData.append("kode", formData.kode);
      submitData.append("no_tenant", formData.no_tenant);
      submitData.append("jumlah_petugas", formData.jumlah_petugas.toString());
      submitData.append("aktif", formData.aktif ? "1" : "0");

      if (formData.logo) {
        submitData.append("logo", formData.logo);
      }

      if (formData.deskripsi) {
        submitData.append("deskripsi", formData.deskripsi);
      }

      await createAgency(submitData).unwrap();

      toast.success("Instansi berhasil ditambahkan");
      router.push("/agencies");
    } catch (error: any) {
      const errorMessage = error.data?.message || "Gagal menambah instansi";

      toast.error(errorMessage);

      console.error("Error detail:", error);
    }
  };

  const handleKodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.value = event.target.value.toUpperCase();
  };

  return (
    <>
      <BackButton />
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold">Tambah Instansi Baru</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nama Instansi */}
          <div>
            <label className="block mb-2 font-medium">
              Nama Instansi <span className="text-red-500">*</span>
            </label>
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

          {/* Akronim Instansi */}
          <div>
            <label className="block mb-2 font-medium">
              Akronim Instansi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("nickname")}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Masukkan akronim instansi"
            />
            {errors.nickname && (
              <p className="text-red-500 text-sm mt-1">
                {errors.nickname.message}
              </p>
            )}
            {RenderFieldError("nickname", errorsAPI)}
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
            <label className="block mb-2 font-medium">
              Nomor Tenant <span className="text-red-500">*</span>
            </label>
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
            <label className="block mb-2 font-medium">
              Jumlah Petugas <span className="text-red-500">*</span>
            </label>
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
            {errors.logo && (
              <p className="text-red-500 text-sm mt-1">
                {errors.logo.message as string}
              </p>
            )}
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

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi Instansi
            </label>
            <Controller
              name="deskripsi"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TiptapEditor value={value as string} onChange={onChange} />
              )}
            />
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
              {isSubmitting ? "Menambahkan..." : "Tambah"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddAgency;
