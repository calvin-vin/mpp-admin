// hooks/useEducation.ts
import { BASE_API_URL } from "@/utils/constants";
import axios from "axios";
import { useEffect, useState } from "react";

// Definisi tipe untuk data pendidikan
interface Education {
  value: number;
  label: string;
}

export const useEducation = () => {
  const [educations, setEducations] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEducations = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${BASE_API_URL}/api/v1/pendidikan/list`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        // Pastikan struktur response sesuai
        if (response.data && Array.isArray(response.data.data)) {
          const data = response.data.data.map(
            (education: { id: number; pendidikan: string }) => ({
              value: education.id, // Gunakan ID sebagai value
              label: education.pendidikan, // Pendidikan sebagai label
            })
          );

          setEducations(data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Gagal mengambil data pendidikan"
        );

        // Fallback data jika gagal
        setEducations([
          {
            value: 1,
            label: "Tidak/Belum Sekolah",
          },
          {
            value: 2,
            label: "SD Sederajat",
          },
          {
            value: 3,
            label: "SLTP Sederajat",
          },
          {
            value: 4,
            label: "SLTA Sederajat",
          },
          {
            value: 5,
            label: "Diploma I/II",
          },
          {
            value: 6,
            label: "Akademi/Diploma III",
          },
          {
            value: 7,
            label: "Sarjana Muda/Diploma IV",
          },
          {
            value: 8,
            label: "Strata 1/S1",
          },
          {
            value: 9,
            label: "Strata 2/S2",
          },
          {
            value: 10,
            label: "Strata 3/S3",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEducations();
  }, []);

  return {
    educations,
    isLoading,
    error,
    // Fungsi utilitas untuk mendapatkan nama pendidikan berdasarkan ID
    getEducationNameById: (value: number) => {
      const education = educations.find((edu) => edu.value === value);
      return education ? education.label : "";
    },
  };
};
