// hooks/useJob.ts
import { BASE_API_URL } from "@/utils/constants";
import axios from "axios";
import { useEffect, useState } from "react";

// Definisi tipe untuk data pekerjaan
interface Job {
  value: number;
  label: string;
}

export const useJob = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${BASE_API_URL}/api/v1/pekerjaan/list`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        // Pastikan struktur response sesuai
        if (response.data && Array.isArray(response.data.data)) {
          const data = response.data.data.map(
            (job: { id: number; pekerjaan: string }) => ({
              value: job.id, // Gunakan ID sebagai value
              label: job.pekerjaan, // Pekerjaan sebagai label
            })
          );

          setJobs(data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Gagal mengambil data pekerjaan"
        );
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return {
    jobs,
    isLoading,
    error,
    // Fungsi utilitas untuk mendapatkan nama pekerjaan berdasarkan ID
    getJobNameById: (value: number) => {
      const job = jobs.find((edu) => edu.value === value);
      return job ? job.label : "";
    },
  };
};
