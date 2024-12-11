"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  className?: string;
  classNameWrapper?: string;
  label?: string;
  fallbackPath?: string; // Path alternatif jika tidak bisa kembali
  onBack?: () => void; // Callback kustom sebelum navigasi
}

export const BackButton: React.FC<BackButtonProps> = ({
  className = "",
  classNameWrapper = "",
  label = "Kembali",
  fallbackPath,
  onBack,
}) => {
  const router = useRouter();

  const handleGoBack = () => {
    // Jalankan callback kustom jika ada
    if (onBack) {
      onBack();
    }

    try {
      // Coba kembali ke halaman sebelumnya
      router.back();
    } catch (error) {
      // Jika gagal, gunakan fallback path
      if (fallbackPath) {
        router.push(fallbackPath);
      } else {
        // Fallback default
        router.push("/");
      }
    }
  };

  return (
    <div className={classNameWrapper ? classNameWrapper : "mb-6"}>
      <button
        onClick={handleGoBack}
        className={`flex items-center space-x-2 text-gray-700 hover:text-gray-900 
        transition-colors duration-300 ${className}`}
      >
        <ArrowLeft className="w-5 h-5" />
        <span>{label}</span>
      </button>
    </div>
  );
};
