import * as z from "zod";

export const roleSchema = z.object({
  nama: z.string().min(3, { message: "Nama role minimal 3 karakter" }),
  menu: z.array(z.string()).min(1, { message: "Pilih minimal satu menu" }),
  status: z.enum(["ACTIVE", "INACTIVE"], {
    errorMap: () => ({ message: "Status harus ACTIVE atau INACTIVE" }),
  }),
});

// Tipe untuk form data
export type RoleFormData = z.infer<typeof roleSchema>;
