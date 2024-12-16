"use client";

import { BackButton } from "@/app/(components)/BackButton";
import ErrorDisplay from "@/app/(components)/ErrorDisplay";
import LoadingSpinner from "@/app/(components)/LoadingSpinner";
import { RenderFieldError } from "@/app/(components)/RenderFieldError";
import { useEducation } from "@/hooks/useEducation";
import { useJob } from "@/hooks/useJob";
import useServices from "@/hooks/useServices";
import { useCreateQueueMutation } from "@/state/queueSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, SaveIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  FormData,
  formSchema,
  jenisPemohonOptions,
  statusKawinOptions,
} from "../utils";
import { useRouter } from "next/navigation";

const AddQueue = () => {
  const router = useRouter();
  const [createQueueMutation, { error: errorsAPI }] = useCreateQueueMutation();

  const {
    serviceList,
    isLoading: isLoadingServices,
    error: serviceError,
    refetch: refetchServices,
  } = useServices();

  const {
    educations,
    isLoading: isLoadingEducations,
    error: educationError,
  } = useEducation();

  const { jobs, isLoading: isLoadingJobs, error: jobError } = useJob();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (formData: FormData) => {
    try {
      const payload = {
        ...formData,
        usia: formData.usia.toString(),
        jam: formData.jam.slice(0, 5),
        id_layanan: formData.id_layanan,
        tanggal: formData.tanggal
          ? formData.tanggal.toISOString().split("T")[0]
          : null,
      };

      await createQueueMutation(payload).unwrap();
      toast.success("Berhasil menambah data antrian");
      router.push("/queues");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Gagal menambah antrian");
    }
  };

  if (serviceError || educationError || jobError) {
    <ErrorDisplay
      callback={() => {
        refetchServices();
      }}
    />;
  }

  if (isLoadingServices || isLoadingEducations || isLoadingJobs) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <BackButton />
      <div className="container mx-auto p-6 bg-white rounded-lg">
        <div className="flex items-center mb-6">
          <Box className="mr-2" />
          <h1 className="text-2xl font-bold">Tambah Antrian</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nama Pemohon */}
          <div>
            <label htmlFor="nama_lengkap" className="block mb-2">
              Nama Pemohon
            </label>
            <input
              {...register("nama_lengkap")}
              className="w-full p-2 border rounded"
              placeholder="Masukkan nama pemohon"
            />
            {errors.nama_lengkap && (
              <p className="text-red-500 text-sm mt-1">
                {errors.nama_lengkap.message}
              </p>
            )}
            {RenderFieldError("nama_lengkap", errorsAPI)}
          </div>

          {/* No HP */}
          <div>
            <label htmlFor="mobile" className="block mb-2">
              No HP
            </label>
            <input
              {...register("mobile")}
              className="w-full p-2 border rounded"
              placeholder="Masukkan no hp"
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm mt-1">
                {errors.mobile.message}
              </p>
            )}
            {RenderFieldError("mobile", errorsAPI)}
          </div>

          {/* Umur */}
          <div>
            <label htmlFor="usia" className="block mb-2">
              Umur
            </label>
            <input
              type="number"
              {...register("usia", { valueAsNumber: true })}
              className="w-full p-2 border rounded"
              placeholder="Masukkan umur"
            />
            {errors.usia && (
              <p className="text-red-500 text-sm mt-1">{errors.usia.message}</p>
            )}
            {RenderFieldError("usia", errorsAPI)}
          </div>

          {/* Jenis Kelamin */}
          <div>
            <label className="block mb-2">Jenis Kelamin</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="L"
                  {...register("jenis_kelamin")}
                  className="mr-2"
                />
                Laki-laki
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="P"
                  {...register("jenis_kelamin")}
                  className="mr-2"
                />
                Perempuan
              </label>
            </div>
            {errors.jenis_kelamin && (
              <p className="text-red-500 text-sm mt-1">
                {errors.jenis_kelamin.message}
              </p>
            )}
            {RenderFieldError("jenis_kelamin", errorsAPI)}
          </div>

          {/* Pendidikan */}
          <div>
            <label htmlFor="pendidikan" className="block mb-2">
              Pendidikan
            </label>
            <select
              {...register("pendidikan")}
              className="w-full p-2 border rounded"
            >
              <option value="">Pilih Pendidikan</option>
              {educations.map((option: any) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.pendidikan && (
              <p className="text-red-500 text-sm mt-1">
                {errors.pendidikan.message}
              </p>
            )}
            {RenderFieldError("pendidikan", errorsAPI)}
          </div>

          {/* Pekerjaan */}
          <div>
            <label htmlFor="pekerjaan" className="block mb-2">
              Pekerjaan
            </label>
            <select
              {...register("pekerjaan")}
              className="w-full p-2 border rounded"
            >
              <option value="">Pilih Pekerjaan</option>
              {jobs.map((option: any) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.pekerjaan && (
              <p className="text-red-500 text-sm mt-1">
                {errors.pekerjaan.message}
              </p>
            )}
            {RenderFieldError("pekerjaan", errorsAPI)}
          </div>

          {/* Status Perkawinan */}
          <div>
            <label htmlFor="status_kawin" className="block mb-2">
              Status Pernikahan
            </label>
            <select
              {...register("status_kawin")}
              className="w-full p-2 border rounded"
            >
              {statusKawinOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.status_kawin && (
              <p className="text-red-500 text-sm mt-1">
                {errors.status_kawin.message}
              </p>
            )}
          </div>

          {/* Layanan */}
          <div>
            <label htmlFor="id_layanan" className="block mb-2">
              Layanan
            </label>
            <select
              {...register("id_layanan")}
              className="w-full p-2 border rounded"
            >
              <option value="">Pilih Layanan</option>
              {serviceList.map((option: any) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.id_layanan && (
              <p className="text-red-500 text-sm mt-1">
                {errors.id_layanan.message}
              </p>
            )}
            {RenderFieldError("id_layanan", errorsAPI)}
          </div>

          {/* Jenis Permohonan */}
          <div>
            <label htmlFor="jenis_permohonan" className="block mb-2">
              Jenis Permohonan
            </label>
            <select
              {...register("jenis_permohonan")}
              className="w-full p-2 border rounded"
            >
              {jenisPemohonOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.jenis_permohonan && (
              <p className="text-red-500 text-sm mt-1">
                {errors.jenis_permohonan.message}
              </p>
            )}
          </div>

          {/* Input Tanggal Kunjungan */}
          <div>
            <label htmlFor="tanggal" className="block mb-2">
              Tanggal Kunjungan
            </label>
            <Controller
              name="tanggal"
              control={control}
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={(date: any) => field.onChange(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Pilih Tanggal Kunjungan"
                  className="w-full p-2 border rounded"
                  isClearable
                />
              )}
            />
            {errors.tanggal && (
              <p className="text-red-500 text-sm mt-1">
                {errors.tanggal.message}
              </p>
            )}
            {RenderFieldError("tanggal", errorsAPI)}
          </div>

          {/* Input Jam Kunjungan */}
          <div>
            <label htmlFor="jam" className="block mb-2">
              Jam Kunjungan
            </label>
            <input
              type="time"
              {...register("jam")}
              className="w-full p-2 border rounded"
            />
            {errors.jam && (
              <p className="text-red-500 text-sm mt-1">{errors.jam.message}</p>
            )}
            {RenderFieldError("jam", errorsAPI)}
          </div>

          {/* Tombol Submit */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center bg-primary text-white font-semibold py-2 px-4 rounded 
            hover:bg-primary-dark transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SaveIcon className="w-5 h-5 mr-2" />
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddQueue;
