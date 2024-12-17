"use client";
import type { RoleFormData } from "../utils";

import { BackButton } from "@/app/(components)/BackButton";
import LoadingSpinner from "@/app/(components)/LoadingSpinner";
import { RenderFieldError } from "@/app/(components)/RenderFieldError";
import { useMenus } from "@/hooks/useMenus";
import { useCreateRoleMutation } from "@/state/roleSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Select from "react-select";
import { roleSchema } from "../utils";
import { PlusCircle } from "lucide-react";

const AddRole = () => {
  const router = useRouter();
  const { menuOptions, isLoading: isLoadingGetMenu } = useMenus();
  const [createRole, { error: errorsAPI }] = useCreateRoleMutation();

  // Hook form
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
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
      <BackButton />
      <div className="container mx-auto p-6 bg-white rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Tambah Role Baru</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Input Nama Role */}
          <div>
            <label htmlFor="nama" className="block mb-2">
              Nama Role <span className="text-red-500">*</span>
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
            <label className="block mb-2">
              Pilih Menu <span className="text-red-500">*</span>
            </label>
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
              Status <span className="text-red-500">*</span>
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
              className="w-full flex justify-center items-center bg-primary text-white font-semibold py-2 px-4 rounded 
            hover:bg-primary-dark transition-colors duration-300 
            disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              {isSubmitting ? "Menambahkan..." : "Tambah Role"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddRole;
