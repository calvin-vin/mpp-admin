import * as z from "zod";

export const formSchema = z.object({
  nama_lengkap: z.string().min(2, { message: "Nama minimal 2 karakter" }),
  usia: z.coerce
    .number({ message: "Harus merupakan angka" })
    .min(1, { message: "Umur harus diisi" })
    .max(100, { message: "Umur tidak valid" }),
  jenis_kelamin: z.enum(["L", "P"], { message: "Jenis kelamin harus dipilih" }),
  pendidikan: z.string().min(1, { message: "Pendidikan harus diisi" }),
  status_kawin: z.string().min(1, { message: "Status kawin harus diisi" }),
  pekerjaan: z.string().min(1, { message: "Pekerjaan harus diisi" }),
  id_layanan: z.string().min(1, { message: "Layanan harus diisi" }),
  jenis_permohonan: z
    .string()
    .min(1, { message: "Jenis Permohonan harus dipilih" }),
  hadir: z.boolean(),
  mengisi_ikm: z.enum(["1", "0"], { message: "Status IKM harus dipilih" }),
  tanggal: z.date({ message: "Harus merupakan tanggal" }),
  jam: z.string().min(1, { message: "Jam harus diisi" }),
});

// Definisi tipe berdasarkan skema
export type FormData = z.infer<typeof formSchema>;

export const jenisPemohonOptions = [
  { value: "", label: "Pilih Jenis Permohonan" },
  { value: "1", label: "Mengurus Sendiri" },
  { value: "2", label: "Dikuasakan" },
];

export const statusKawinOptions = [
  { value: "", label: "Pilih Status Pernikahan" },
  { value: "1", label: "Lajang" },
  { value: "2", label: "Menikah" },
  { value: "3", label: "Cerai Hidup" },
  { value: "4", label: "Cerai Mati" },
];

export const mengisiIKMOptions = [
  { value: "0", label: "Belum Diisi" },
  { value: "1", label: "Sudah Diisi" },
];
