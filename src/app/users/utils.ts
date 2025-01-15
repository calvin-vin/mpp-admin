import * as z from "zod";

export const formSchema = z.object({
  nip: z.string().min(1, { message: "NIP harus diisi" }),
  nama_lengkap: z.string().min(1, { message: "Nama lengkap harus diisi" }),
  email: z.string().email({ message: "Email tidak valid" }),
  mobile: z.string().min(8, { message: "Nomor HP minimal 8 karakter" }),
  status: z.enum(["ACTIVE", "INACTIVE"], { message: "Status harus dipilih" }),
  id_role: z.string().min(1, { message: "Role harus dipilih" }),
  id_instansi: z
    .union([z.string(), z.number()])
    .transform((val) => {
      return val.toString();
    })
    .refine((val) => val.length > 0, { message: "Instansi harus dipilih" }),
});

export type FormData = z.infer<typeof formSchema>;
