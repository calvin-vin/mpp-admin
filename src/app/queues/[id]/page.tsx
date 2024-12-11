"use client";

import { BackButton } from "@/app/(components)/BackButton";
import ErrorDisplay from "@/app/(components)/ErrorDisplay";
import LoadingSpinner from "@/app/(components)/LoadingSpinner";
import { RenderFieldError } from "@/app/(components)/RenderFieldError";
import { useEducation } from "@/hooks/useEducation";
import { useJob } from "@/hooks/useJob";
import useServices from "@/hooks/useServices";
import {
  useGetSingleQueueQuery,
  useUpdateQueueMutation,
} from "@/state/queueSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, SaveIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  FormData,
  formSchema,
  jenisPemohonOptions,
  mengisiIKMOptions,
  statusKawinOptions,
} from "../utils";

const QueueDetail = () => {
  const { id } = useParams();
  const {
    data,
    isLoading: isLoadingQueue,
    refetch: refetchQueue,
    isError: isErrorQueue,
  } = useGetSingleQueueQuery({ id });
  const [updateQueueMutation, { error: errorsAPI }] = useUpdateQueueMutation();

  // Gunakan hook useServices
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
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hadir: false,
      mengisi_ikm: "0",
    },
  });

  useEffect(() => {
    if (data?.data) {
      const queueData = data.data;
      reset({
        nama_lengkap: queueData.nama_lengkap,
        usia: parseInt(queueData.usia),
        jenis_kelamin: queueData.jenis_kelamin === "L" ? "L" : "P",
        pendidikan: queueData.pendidikan,
        pekerjaan: queueData.pekerjaan,
        status_kawin: queueData.status_kawin,
        id_layanan: queueData.id_layanan.toString(),
        jenis_permohonan: queueData.jenis_permohonan,
        hadir: queueData.hadir === "1",
        mengisi_ikm: queueData.mengisi_ikm === "1" ? "1" : "0",
        tanggal: queueData.tanggal ? new Date(queueData.tanggal) : undefined,
        jam: queueData.jam || "",
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData: FormData) => {
    try {
      const payload = {
        id_antrian: id as string,
        ...formData,
        usia: formData.usia.toString(),
        jam: formData.jam.slice(0, 5),
        hadir: formData.hadir ? "1" : "0",
        id_layanan: formData.id_layanan,
        tanggal: formData.tanggal
          ? formData.tanggal.toISOString().split("T")[0]
          : null,
      };

      await updateQueueMutation(payload).unwrap();

      toast.success("Berhasil mengupdate data antrian");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Gagal memperbarui antrian");
    }
  };

  if (serviceError || isErrorQueue || educationError || jobError) {
    <ErrorDisplay
      callback={() => {
        refetchServices();
        refetchQueue();
      }}
    />;
  }

  if (
    isLoadingQueue ||
    isLoadingServices ||
    isLoadingEducations ||
    isLoadingJobs
  ) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <BackButton />
      <div className="container mx-auto p-6 bg-white rounded-lg">
        <div className="flex items-center mb-6">
          <Box className="mr-2" />
          <h1 className="text-2xl font-bold">#{data.data.kode}</h1>
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

          {/* Kehadiran */}
          <div>
            <label className="flex items-center">
              <input type="checkbox" {...register("hadir")} className="mr-2" />
              Sudah Hadir
            </label>
          </div>

          {/* Status IKM */}
          <div>
            <label htmlFor="mengisi_ikm" className="block mb-2">
              Status IKM
            </label>
            <select
              {...register("mengisi_ikm")}
              className="w-full p-2 border rounded"
            >
              {mengisiIKMOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.mengisi_ikm && (
              <p className="text-red-500 text-sm mt-1">
                {errors.mengisi_ikm.message}
              </p>
            )}
            {RenderFieldError("mengisi_ikm", errorsAPI)}
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

export default QueueDetail;
