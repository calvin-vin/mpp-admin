"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Select from "react-select";
import toast from "react-hot-toast";
import axios from "axios"; // Pastikan mengimpor axios
import { API_HOST } from "@/utils/constants"; // Sesuaikan path import
import { BackButton } from "@/app/(components)/BackButton";
import LoadingSpinner from "@/app/(components)/LoadingSpinner";
import { useMenus } from "@/hooks/useMenus";
import { useRouter } from "next/navigation";
import { useCreateRoleMutation } from "@/state/roleSlice";
import { RenderFieldError } from "@/app/(components)/RenderFieldError";

// Definisi skema validasi
const roleSchema = z.object({
  nama: z.string().min(3, { message: "Nama role minimal 3 karakter" }),
  menu: z.array(z.string()).min(1, { message: "Pilih minimal satu menu" }),
  status: z.enum(["ACTIVE", "INACTIVE"], {
    errorMap: () => ({ message: "Status harus ACTIVE atau INACTIVE" }),
  }),
});

// Tipe untuk form data
type RoleFormData = z.infer<typeof roleSchema>;

const AddRole = () => {
  const router = useRouter();
  const { menuOptions, isLoading: isLoadingGetMenu, error } = useMenus();
  const [createRole, { error: errorsAPI }] = useCreateRoleMutation();

  // Hook form
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      status: "ACTIVE",
      menu: [],
    },
  });

  // Handler submit
  const onSubmit = async (data: RoleFormData) => {
    try {
      await createRole(data).unwrap();

      toast.success("Role berhasil ditambahkan");
      router.push("/roles");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal menambahkan role");
    }
  };

  if (isLoadingGetMenu) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="container px-6">
        <BackButton />
      </div>
      <div className="container mx-auto p-6 bg-white rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Tambah Role Baru</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Input Nama Role */}
          <div>
            <label htmlFor="nama" className="block mb-2">
              Nama Role
            </label>
            <input
              {...register("nama")}
              className="w-full p-2 border rounded"
              placeholder="Masukkan nama role"
            />
            {errors.nama && (
              <p className="text-red-500 text-sm mt-1">{errors.nama.message}</p>
            )}
            {RenderFieldError("nama", errorsAPI)}
          </div>

          {/* Multi-Select Menu */}
          <div>
            <label className="block mb-2">Pilih Menu</label>
            <Controller
              name="menu"
              control={control}
              render={({ field: { onChange, value, ref } }) => (
                <Select
                  ref={ref}
                  options={menuOptions}
                  isMulti
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Pilih menu..."
                  value={menuOptions
                    .flatMap((group) => group.options)
                    .filter((option: any) => value.includes(option.value))}
                  onChange={(selectedOptions) => {
                    onChange(
                      selectedOptions
                        ? selectedOptions.map((option: any) => option.value)
                        : []
                    );
                  }}
                />
              )}
            />
            {errors.menu && (
              <p className="text-red-500 text-sm mt-1">{errors.menu.message}</p>
            )}
            {RenderFieldError("menu", errorsAPI)}
          </div>

          {/* Status Role */}
          <div>
            <label htmlFor="status" className="block mb-2">
              Status
            </label>
            <select
              {...register("status")}
              className="w-full p-2 border rounded"
            >
              <option value="ACTIVE">Aktif</option>
              <option value="INACTIVE">Tidak Aktif</option>
            </select>
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
              className="w-full bg-primary text-white py-2 rounded 
            hover:bg-primary-dark transition-colors 
            disabled:opacity-50"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Role"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddRole;
