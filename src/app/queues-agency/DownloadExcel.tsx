import { API_HOST } from "@/utils/constants";
import { getHeaders } from "@/utils/helpers";
import { format } from "date-fns";
import { Download } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface DateRange {
  from?: Date | null;
  to?: Date | null;
}

interface FilterState {
  search: string;
  service: string;
  dateRange: DateRange;
}

const DownloadExcel = ({ filters }: { filters: FilterState }) => {
  const [isLoading, setIsLoading] = useState(false);

  function handleDownload() {
    setIsLoading(true);

    if (!filters.dateRange.from || !filters.dateRange.to) {
      toast.error("Wajib menginput data tanggal mulai dan tanggal selesai");
      setIsLoading(false);
      return;
    }

    const startDate = format(filters.dateRange.from, "yyyy-MM-dd");
    const endDate = format(filters.dateRange.to, "yyyy-MM-dd");
    let url = `${API_HOST}/antrian/laporan?start_date=${startDate}&end_date=${endDate}`;

    if (filters.service) {
      url += `&id_layanan=${filters.service}`;
    }

    fetch(url, {
      method: "GET",
      headers: getHeaders(),
    })
      .then((response) => {
        return response.blob();
      })
      .then((blob) => {
        const fileName = "Antrian.xls";
        const a = document.createElement("a");
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        document.body.append(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        toast.error("Gagal mendownload data");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <button
      onClick={handleDownload}
      className={`flex items-center text-white font-semibold py-2 px-4 rounded transition 
    ${
      isLoading
        ? "bg-gray-500 cursor-not-allowed"
        : "bg-gray-800 hover:bg-gray-900"
    }`}
      disabled={isLoading}
    >
      <Download className="w-5 h-5 mr-2" />
      Download Laporan
    </button>
  );
};

export default DownloadExcel;
