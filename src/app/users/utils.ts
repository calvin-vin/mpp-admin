import * as z from "zod";

export const formSchema = z.object({
  nip: z.string().min(2, { message: "NIP minimal 2 karakter" }),
  nama_lengkap: z
    .string()
    .min(2, { message: "Nama lengkap minimal 2 karakter" }),
  email: z.string().email({ message: "Email tidak valid" }),
  mobile: z.string().min(8, { message: "Nomor HP minimal 8 karakter" }),
  status: z.enum(["ACTIVE", "INACTIVE"], { message: "Status harus dipilih" }),
  id_role: z.string().min(1, { message: "Role harus dipilih" }),
  id_instansi: z.string().min(1, { message: "Instansi harus dipilih" }),
});

export type FormData = z.infer<typeof formSchema>;
