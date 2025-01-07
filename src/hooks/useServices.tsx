import { serviceSlice } from "@/state/serviceSlice";
import { useMemo } from "react";

// Interface untuk opsi layanan
interface ServiceOption {
  value: string | number;
  label: string;
}

// Custom hook menggunakan RTK Query
export const useServices = (agencyId: string | null = null) => {
  // Gunakan query untuk mendapatkan semua layanan
  const {
    data: servicesData,
    isLoading,
    error,
    refetch,
  } = serviceSlice.endpoints.getAllServices.useQuery({
    page: 1,
    perPage: 999,
    agencyId, // Kirimkan agencyId sebagai parameter
  });

  // Transform data layanan menjadi opsi untuk dropdown/select
  const serviceList = useMemo<ServiceOption[]>(() => {
    if (!servicesData?.services) return [];

    return servicesData.services
      .map((service) => ({
        value: service.id_layanan, // Gunakan ID sebagai value
        label: service.layanan, // Nama layanan sebagai label
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [servicesData, agencyId]);

  return {
    serviceList, // Daftar layanan untuk dropdown
    services: servicesData?.services || [], // Daftar lengkap layanan
    pagination: servicesData?.pagination, // Informasi pagination
    isLoading, // Status loading
    error, // Error jika terjadi
    refetch, // Fungsi untuk me-refresh data
  };
};

// Fungsi tambahan untuk mendapatkan label layanan
export const getServiceLabel = (
  services: ServiceOption[],
  value: string | number
) => {
  const service = services.find((service) => service.value === value);
  return service?.label || "Tidak diketahui";
};

export default useServices;
