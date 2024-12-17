import { agencySlice } from "@/state/agencySlice"; // Pastikan slice agency sudah dibuat
import { useCallback, useMemo } from "react";

interface AgencyOption {
  value: string | number;
  label: string;
}

export const useAgencies = () => {
  const {
    data: agenciesData,
    isLoading,
    error,
    refetch,
  } = agencySlice.endpoints.getAgencies.useQuery({
    page: 1,
    perPage: 999,
  });

  // Transform data agency menjadi opsi untuk dropdown/select
  const agencyList = useMemo<AgencyOption[]>(() => {
    if (!agenciesData?.agencies) return [];

    return agenciesData.agencies.map((agency) => ({
      value: agency.id_instansi,
      label: agency.instansi,
    }));
  }, [agenciesData]);

  // Fungsi untuk mendapatkan opsi agency spesifik
  const getAgencyById = useCallback(
    (id: number | string) => {
      return agenciesData?.agencies.find(
        (agency) =>
          agency.id_instansi === (typeof id === "string" ? parseInt(id) : id)
      );
    },
    [agenciesData]
  );

  return {
    agencyList, // Daftar agency untuk dropdown
    agencies: agenciesData?.agencies || [], // Daftar lengkap agency
    pagination: agenciesData?.pagination, // Informasi pagination
    getAgencyById, // Fungsi untuk mendapatkan detail agency berdasarkan ID
    isLoading, // Status loading
    error, // Error jika terjadi
    refetch, // Fungsi untuk me-refresh data
  };
};

// Fungsi tambahan untuk mendapatkan label agency
export const getAgencyLabel = (
  agencies: AgencyOption[],
  value: string | number
) => {
  const agency = agencies.find((agency) => agency.value === value);
  return agency?.label || "Tidak diketahui";
};

export default useAgencies;
