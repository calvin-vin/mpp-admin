"use client";

import type { FormData } from "../utils";

import { BackButton } from "@/app/(components)/BackButton";
import ErrorDisplay from "@/app/(components)/ErrorDisplay";
import LoadingSpinner from "@/app/(components)/LoadingSpinner";
import { RenderFieldError } from "@/app/(components)/RenderFieldError";
import useAgencies from "@/hooks/useAgencies";
import useRoles from "@/hooks/useRoles";
import { useCreateUserMutation } from "@/state/userSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { formSchema } from "../utils";

const AddUser = () => {
  const router = useRouter();
  const {
    roleList,
    isLoading: roleLoading,
    error: roleError,
    refetch: refetchRole,
  } = useRoles();
  const {
    agencyList,
    isLoading: agencyLoading,
    error: agencyError,
    refetch: refetchAgency,
  } = useAgencies();
  const [createUser, { error: errorsAPI }] = useCreateUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "ACTIVE",
    },
  });

  const onSubmit = async (formData: FormData) => {
    try {
      const submitData = new FormData();

      submitData.append("nip", formData.nip);
      submitData.append("nama_lengkap", formData.nama_lengkap);
      submitData.append("email", formData.email);
      submitData.append("mobile", formData.mobile);
      submitData.append("status", formData.status);
      submitData.append("id_role", formData.id_role.toString());
      submitData.append("id_instansi", formData.id_instansi.toString());

      await createUser(submitData).unwrap();

      toast.success("User berhasil ditambahkan");
      router.push("/users");
    } catch (error: any) {
      const errorMessage = error.data?.message || "Gagal menambah user";

      toast.error(errorMessage);
      console.error("Error detail:", error);
    }
  };

  const roleMenuItems = useMemo(
    () =>
      roleList.map((role) => (
        <option key={role.value} value={role.value.toString()}>
          {role.label}
        </option>
      )),
    [roleList]
  );

  const agencyMenuItems = useMemo(
    () =>
      agencyList.map((agency) => (
        <option key={agency.value} value={agency.value.toString()}>
          {agency.label}
        </option>
      )),
    [agencyList]
  );

  if (roleLoading || agencyLoading) return <LoadingSpinner />;
  if (roleError || agencyError)
    return (
      <ErrorDisplay
        callback={() => {
          refetchRole();
          refetchAgency();
        }}
      />
    );

  return (
    <>
      <BackButton />
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold">Tambah User Baru</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* NIP */}
          <div>
            <label className="block mb-2 font-medium">
              NIP <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("nip")}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Masukkan NIP"
            />
            {errors.nip && (
              <p className="text-red-500 text-sm mt-1">{errors.nip.message}</p>
            )}
            {RenderFieldError("nip", errorsAPI)}
          </div>

          {/* Nama Lengkap */}
          <div>
            <label className="block mb-2 font-medium">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("nama_lengkap")}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Masukkan nama lengkap"
            />
            {errors.nama_lengkap && (
              <p className="text-red-500 text-sm mt-1">
                {errors.nama_lengkap.message}
              </p>
            )}
            {RenderFieldError("nama_lengkap", errorsAPI)}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 font-medium">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Masukkan email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
            {RenderFieldError("email", errorsAPI)}
          </div>

          {/* Nomor HP */}
          <div>
            <label className="block mb-2 font-medium">
              Nomor HP <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("mobile")}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Masukkan nomor HP"
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm mt-1">
                {errors.mobile.message}
              </p>
            )}
            {RenderFieldError("mobile", errorsAPI)}
          </div>

          {/* Role */}
          <div>
            <label className="block mb-2 font-medium">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              {...register("id_role")}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {roleMenuItems}
            </select>
            {errors.id_role && (
              <p className="text-red-500 text-sm mt-1">
                {errors.id_role.message}
              </p>
            )}
            {RenderFieldError("id_role", errorsAPI)}
          </div>

          {/* Instansi */}
          <div>
            <label className="block mb-2 font-medium">
              Instansi <span className="text-red-500">*</span>
            </label>
            <select
              {...register("id_instansi")}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Pilih Instansi</option>
              {agencyMenuItems}
            </select>
            {errors.id_instansi && (
              <p className="text-red-500 text-sm mt-1">
                {errors.id_instansi.message}
              </p>
            )}
            {RenderFieldError("id_instansi", errorsAPI)}
          </div>

          {/* Status */}
          <div>
            <label className="block mb-2 font-medium">
              Status <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="ACTIVE"
                  {...register("status")}
                  className="form-radio h-4 w-4 text-primary"
                />
                <span className="ml-2">Aktif</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="INACTIVE"
                  {...register("status")}
                  className="form-radio h-4 w-4 text-primary"
                />
                <span className="ml-2">Tidak Aktif</span>
              </label>
            </div>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">
                {errors.status.message}
              </p>
            )}
            {RenderFieldError("status", errorsAPI)}
          </div>

          {/* Tombol Submit */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center bg-primary text-white font-semibold py-2 px-4 rounded 
            hover:bg-primary-dark transition-colors duration-300 
            disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              {isSubmitting ? "Menambahkan..." : "Tambah User"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddUser;
