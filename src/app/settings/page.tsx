"use client";

import LoadingSpinner from "@/app/(components)/LoadingSpinner";
import { RenderFieldError } from "@/app/(components)/RenderFieldError";
import {
  useGetSettingQuery,
  useUpdateSettingMutation,
} from "@/state/settingSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import Image from "next/image";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const formSchema = z.object({
  nama_aplikasi: z
    .string()
    .min(2, { message: "Nama aplikasi minimal 2 karakter" }),
  instagram: z.string().min(2, { message: "Instagram minimal 2 karakter" }),
  youtube: z.string().min(2, { message: "Youtube minimal 2 karakter" }),
  facebook: z.string().min(2, { message: "Facebook minimal 2 karakter" }),
  whatsapp: z.string().min(2, { message: "Whatsapp minimal 2 karakter" }),
  footer: z.string().min(2, { message: "Footer minimal 2 karakter" }),
  versi: z.string().min(2, { message: "Versi minimal 2 karakter" }),
  logo: z.instanceof(File).optional(),
});

// Definisi tipe berdasarkan skema
type FormData = z.infer<typeof formSchema>;

const Setting = () => {
  const { data: settingData, isLoading: isLoadingSetting } =
    useGetSettingQuery();
  const [updateSetting, { error: errorsAPI }] = useUpdateSettingMutation();

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

  useEffect(() => {
    if (settingData?.data) {
      reset({
        nama_aplikasi: settingData.data.nama_aplikasi,
        instagram: settingData.data.instagram,
        youtube: settingData.data.youtube,
        facebook: settingData.data.facebook,
        whatsapp: settingData.data.whatsapp,
        footer: settingData.data.footer,
        versi: settingData.data.versi,
      });
    }
  }, [settingData, reset]);

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
        nama_aplikasi: formData.nama_aplikasi,
        instagram: formData.instagram,
        youtube: formData.youtube,
        facebook: formData.facebook,
        whatsapp: formData.whatsapp,
        footer: formData.footer,
        versi: formData.versi,
        tgl: settingData.data.tgl,
      }).forEach(([key, value]) => submitData.append(key, value));

      if (formData.logo) {
        submitData.append("logo", formData.logo);
      }

      await updateSetting(submitData).unwrap();

      toast.success("Konfigurasi berhasil diperbarui");
    } catch (error: any) {
      const errorMessage =
        error.data?.message || "Gagal memperbarui konfigurasi";

      toast.error(errorMessage);
      console.error("Error details:", error);
    }
  };

  // Loading state
  if (isLoadingSetting) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold">Konfigurasi</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nama Aplikasi */}
          <div>
            <label className="block mb-2 font-medium">Nama Aplikasi</label>
            <input
              type="text"
              {...register("nama_aplikasi")}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Masukkan nama aplikasi"
            />
            {errors.nama_aplikasi && (
              <p className="text-red-500 text-sm mt-1">
                {errors.nama_aplikasi.message}
              </p>
            )}
            {RenderFieldError("nama_aplikasi", errorsAPI)}
          </div>

          {/* Instagram */}
          <div>
            <label className="block mb-2 font-medium">Instagram</label>
            <input
              type="text"
              {...register("instagram")}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Masukkan instagram"
            />
            {errors.instagram && (
              <p className="text-red-500 text-sm mt-1">
                {errors.instagram.message}
              </p>
            )}
            {RenderFieldError("instagram", errorsAPI)}
          </div>

          {/* Youtube */}
          <div>
            <label className="block mb-2 font-medium">Youtube</label>
            <input
              type="text"
              {...register("youtube")}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Masukkan youtube"
            />
            {errors.youtube && (
              <p className="text-red-500 text-sm mt-1">
                {errors.youtube.message}
              </p>
            )}
            {RenderFieldError("youtube", errorsAPI)}
          </div>

          {/* Facebook */}
          <div>
            <label className="block mb-2 font-medium">Facebook</label>
            <input
              type="text"
              {...register("facebook")}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Masukkan facebook"
            />
            {errors.facebook && (
              <p className="text-red-500 text-sm mt-1">
                {errors.facebook.message}
              </p>
            )}
            {RenderFieldError("facebook", errorsAPI)}
          </div>

          {/* Whatsapp */}
          <div>
            <label className="block mb-2 font-medium">Whatsapp</label>
            <input
              type="text"
              {...register("whatsapp")}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Masukkan whatsapp"
            />
            {errors.whatsapp && (
              <p className="text-red-500 text-sm mt-1">
                {errors.whatsapp.message}
              </p>
            )}
            {RenderFieldError("whatsapp", errorsAPI)}
          </div>

          {/* Footer */}
          <div>
            <label className="block mb-2 font-medium">Footer</label>
            <input
              type="text"
              {...register("footer")}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Masukkan footer"
            />
            {errors.footer && (
              <p className="text-red-500 text-sm mt-1">
                {errors.footer.message}
              </p>
            )}
            {RenderFieldError("footer", errorsAPI)}
          </div>

          {/* Versi */}
          <div>
            <label className="block mb-2 font-medium">Versi</label>
            <input
              type="text"
              {...register("versi")}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Masukkan versi"
            />
            {errors.versi && (
              <p className="text-red-500 text-sm mt-1">
                {errors.versi.message}
              </p>
            )}
            {RenderFieldError("versi", errorsAPI)}
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
            {settingData?.data?.logo && !logoFile && (
              <div className="mt-2">
                <Image
                  src={settingData.data.logo}
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

export default Setting;
