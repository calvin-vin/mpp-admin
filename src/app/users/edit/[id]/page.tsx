"use client";

import { BackButton } from "@/app/(components)/BackButton";
import { RenderFieldError } from "@/app/(components)/RenderFieldError";
import {
  useGetSingleUserQuery,
  useUpdateUserMutation,
} from "@/state/userSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, PlusCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

// Skema Validasi Zod (bisa disesuaikan)
const formSchema = z.object({
  nip: z.string().min(2, { message: "NIP minimal 2 karakter" }),
  nama_lengkap: z
    .string()
    .min(2, { message: "Nama lengkap minimal 2 karakter" }),
  email: z.string().email({ message: "Email tidak valid" }),
  mobile: z.string().min(8, { message: "Nomor HP minimal 8 karakter" }),
  status: z.enum(["ACTIVE", "INACTIVE"], { message: "Status harus dipilih" }),
  id_role: z.coerce.number().min(1, { message: "Role harus dipilih" }),
});

// Definisi tipe berdasarkan skema
type FormData = z.infer<typeof formSchema>;

const EditUser = () => {
  const router = useRouter();
  const { id } = useParams();

  // Query untuk mendapatkan data user
  const { data: userData, isLoading: isLoadingUser } = useGetSingleUserQuery({
    id,
  });

  // Mutation untuk update user
  const [updateUser, { error: errorsAPI }] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // Populate form saat data user didapatkan
  useEffect(() => {
    if (userData?.data) {
      const user = userData.data;
      reset({
        nip: user.nip,
        nama_lengkap: user.nama_lengkap,
        email: user.email,
        mobile: user.mobile,
        status: user.status,
        id_role: user.id_role,
      });
    }
  }, [userData, reset]);

  const onSubmit = async (formData: FormData) => {
    try {
      const submitData = new FormData();

      // Tambahkan semua field dari form
      submitData.append("nip", formData.nip);
      submitData.append("nama_lengkap", formData.nama_lengkap);
      submitData.append("email", formData.email);
      submitData.append("mobile", formData.mobile);
      submitData.append("status", formData.status);
      submitData.append("id_role", formData.id_role.toString());

      // Tambahkan ID untuk update
      submitData.append("id", id as string);

      // Gunakan unwrap() untuk mendapatkan error yang lebih detail
      await updateUser(submitData).unwrap();

      toast.success("User berhasil diperbarui");
      router.push("/users");
    } catch (error: any) {
      const errorMessage = error.data?.message || "Gagal memperbarui user";

      toast.error(errorMessage);
      console.error("Error detail:", error);
    }
  };

  // Opsi Role (disesuaikan dengan kebutuhan)
  const roleOptions = [
    { value: "", label: "Pilih Role" },
    { value: "1", label: "Admin" },
    { value: "2", label: "Operator" },
    { value: "3", label: "Supervisor" },
  ];

  // Loading state
  if (isLoadingUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <>
      <BackButton />
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <Edit className="mr-2" /> Edit User
          </h1>
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
              {roleOptions.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            {errors.id_role && (
              <p className="text-red-500 text-sm mt-1">
                {errors.id_role.message}
              </p>
            )}
            {RenderFieldError("id_role", errorsAPI)}
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
              <Edit className="w-5 h-5 mr-2" />
              {isSubmitting ? "Memperbarui..." : "Perbarui User"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditUser;
