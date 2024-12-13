import { roleSlice } from "@/state/roleSlice";
import { useMemo } from "react";

// Interface untuk opsi layanan
interface RoleOption {
  value: string | number;
  label: string;
}

// Custom hook menggunakan RTK Query
export const useRoles = () => {
  // Gunakan query untuk mendapatkan semua layanan
  const {
    data: rolesData,
    isLoading,
    error,
    refetch,
  } = roleSlice.endpoints.getRoles.useQuery({
    page: 1,
    perPage: 100, // Ambil semua layanan
  });

  // Transform data layanan menjadi opsi untuk dropdown/select
  const roleList = useMemo<RoleOption[]>(() => {
    if (!rolesData?.roles) return [];

    return rolesData.roles.map((role) => ({
      value: role.id, // Gunakan ID sebagai value
      label: role.nama, // Nama layanan sebagai label
    }));
  }, [rolesData]);

  return {
    roleList, // Daftar layanan untuk dropdown
    roles: rolesData?.roles || [], // Daftar lengkap layanan
    pagination: rolesData?.pagination, // Informasi pagination
    isLoading, // Status loading
    error, // Error jika terjadi
    refetch, // Fungsi untuk me-refresh data
  };
};

export default useRoles;
