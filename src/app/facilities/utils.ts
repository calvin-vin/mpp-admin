import { createMultipleImageValidation } from "@/utils/helpers";
import * as z from "zod";

export const formSchema = z.object({
  nama_fasilitas: z
    .string()
    .min(2, { message: "Nama fasilitas minimal 2 karakter" }),
  deskripsi: z.string().min(1, { message: "Deskripsi minimal 1 karakter" }),
  foto: createMultipleImageValidation(),
  aktif: z.boolean(),
});

export type FormData = z.infer<typeof formSchema>;
