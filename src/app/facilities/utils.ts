import { createMultipleImageValidation } from "@/utils/helpers";
import * as z from "zod";

export const formSchema = z.object({
  nama_fasilitas: z.string().min(1, { message: "Nama fasilitas harus diisi" }),
  deskripsi: z.string().min(1, { message: "Deskripsi harus diisi" }),
  foto: createMultipleImageValidation(),
  aktif: z.boolean(),
});

export type FormData = z.infer<typeof formSchema>;
