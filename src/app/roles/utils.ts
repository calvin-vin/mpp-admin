import * as z from "zod";

export const roleSchema = z.object({
  nama: z.string().min(1, { message: "Nama role harus diisi" }),
  menu: z.array(z.string()).min(1, { message: "Pilih minimal satu menu" }),
  status: z.enum(["ACTIVE", "INACTIVE"], {
    errorMap: () => ({ message: "Status harus ACTIVE atau INACTIVE" }),
  }),
});

// Tipe untuk form data
export type RoleFormData = z.infer<typeof roleSchema>;
