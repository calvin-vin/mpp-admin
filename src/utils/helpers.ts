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

export function createImageValidation(
  options: {
    required?: boolean;
    maxSize?: number;
  } = {}
) {
  const { required = true, maxSize = MAX_FILE_SIZE } = options;

  // Jika tidak required, izinkan null atau undefined
  if (!required) {
    return z.union([
      z.null(),
      z.undefined(),
      z.instanceof(File).refine((file) => {
        // Jika file ada, lakukan validasi
        if (!file) return true;

        // Validasi ukuran
        if (file.size > maxSize) {
          throw new Error(`Ukuran maksimal file ${maxSize / 1024 / 1024}MB.`);
        }

        // Validasi tipe
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
          throw new Error(
            "Hanya ekstensi .jpg, .jpeg, .png and .webp yang didukung."
          );
        }

        return true;
      }),
    ]);
  }

  // Jika required, gunakan validasi penuh
  return z
    .instanceof(File, { message: "File masih kosong" })
    .refine((file) => {
      // Pastikan file tidak kosong
      return file.size > 0;
    }, "File masih kosong")
    .refine((file) => {
      // Validasi ukuran maksimal
      return file.size <= maxSize;
    }, `Ukuran maksimal file ${maxSize / 1024 / 1024}MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Hanya ekstensi .jpg, .jpeg, .png and .webp yang didukung."
    );
}

export function createMultipleImageValidation(
  options: {
    maxFiles?: number;
    maxFileSize?: number;
    allowedTypes?: string[];
  } = {}
) {
  const {
    maxFiles = 3,
    maxFileSize = MAX_FILE_SIZE,
    allowedTypes = ACCEPTED_IMAGE_TYPES,
  } = options;

  return z
    .array(z.instanceof(File))
    .optional()
    .refine(
      (files) => {
        // Jika tidak ada file, anggap valid
        if (!files || files.length === 0) return true;

        // Validasi jumlah file
        if (files.length > maxFiles) return false;

        // Validasi setiap file
        return files.every((file) => {
          // Pastikan adalah instance File
          if (!(file instanceof File)) return false;

          // Validasi ukuran file
          if (file.size > maxFileSize) return false;

          // Validasi tipe file
          return allowedTypes.includes(file.type);
        });
      },
      {
        message: `File tidak valid. Pastikan:
          - Ukuran < ${maxFileSize / 1024 / 1024}MB
          - Format: ${allowedTypes.join(", ")}
          - Maksimal ${maxFiles} file`,
      }
    );
}

const ACCEPTED_DOCUMENT_TYPES = [
  // PDF
  "application/pdf",

  // Microsoft Office
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.ms-excel", // .xls
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-powerpoint", // .ppt
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx

  // OpenOffice
  "application/vnd.oasis.opendocument.text", // .odt
  "application/vnd.oasis.opendocument.spreadsheet", // .ods
  "application/vnd.oasis.opendocument.presentation", // .odp
];

export function createDocumentValidation(
  options: {
    required?: boolean;
  } = {}
) {
  const { required = true } = options;

  // Jika tidak required, izinkan null atau undefined
  if (!required) {
    return z.union([
      z.null(),
      z.undefined(),
      z.instanceof(File).refine((file) => {
        // Jika file ada, lakukan validasi
        if (!file) return true;

        // Validasi tipe
        if (!ACCEPTED_DOCUMENT_TYPES.includes(file.type)) {
          throw new Error(
            "Tipe dokumen tidak didukung. Gunakan PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, atau dokumen lainnya."
          );
        }

        return true;
      }),
    ]);
  }

  // Jika required, gunakan validasi penuh
  return z
    .instanceof(File, { message: "File masih kosong" })
    .refine((file) => {
      // Pastikan file tidak kosong
      return file.size > 0;
    }, "File masih kosong")
    .refine(
      (file) => ACCEPTED_DOCUMENT_TYPES.includes(file.type),
      "Tipe dokumen tidak didukung. Gunakan PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, atau dokumen lainnya."
    );
}
