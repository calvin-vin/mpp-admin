import * as z from "zod";

export const getHeaders = (): { "X-Key"?: string; Token?: string } => {
  const dataString = localStorage.getItem("store");

  if (!dataString) {
    return {}; // Kembalikan objek kosong jika tidak ada data
  }

  try {
    const data = JSON.parse(dataString);

    return {
      ...(data?.nip && { "X-Key": data.nip }),
      ...(data?.token && { Token: data.token }),
    };
  } catch (error) {
    console.error("Error parsing store data:", error);
    return {};
  }
};

export const formattedDate = (date: Date) => {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};

export const formattedTime = (date: Date) => {
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

export const formatTanggalIndonesia = (tanggal: Date | string) => {
  const date = tanggal instanceof Date ? tanggal : new Date(tanggal);

  // Daftar nama bulan dalam bahasa Indonesia
  const bulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  // Fungsi untuk menambahkan leading zero
  const pad = (num: number) => num.toString().padStart(2, "0");

  return `${pad(date.getDate())} ${
    bulan[date.getMonth()]
  } ${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const imageValidation = z
  .any()
  .refine((files) => files?.length == 1, "Image is required.")
  .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
  .refine(
    (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
    ".jpg, .jpeg, .png and .webp files are accepted."
  );

export const multipleImageValidation = z
  .array(z.instanceof(File))
  .optional()
  .refine(
    (files) => {
      // Jika tidak ada file, anggap valid
      if (!files || files.length === 0) return true;

      // Validasi setiap file
      return files.every((file) => {
        // Pastikan adalah instance File
        if (!(file instanceof File)) return false;

        // Validasi ukuran file
        if (file.size > MAX_FILE_SIZE) return false;

        // Validasi tipe file
        return ACCEPTED_IMAGE_TYPES.includes(file.type);
      });
    },
    {
      message:
        "File tidak valid. Pastikan ukuran < 5MB dan format jpg/jpeg/png/webp.",
    }
  )
  .refine((files) => !files || files.length <= 3, {
    message: "Maksimal 3 file yang dapat diunggah",
  });
