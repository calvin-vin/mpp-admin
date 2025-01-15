import * as z from "zod";
import { createImageValidation } from "@/utils/helpers";

export const formSchema = z.object({
  instansi: z.string().min(1, { message: "Nama instansi harus diisi" }),
  nickname: z.string().min(1, { message: "Akronim instansi harus diisi" }),
  kode: z.string().min(1, { message: "Kode instansi harus diisi" }),
  no_tenant: z.preprocess(
    (val) => String(val),
    z.string().min(1, { message: "Nomor tenant harus diisi" })
  ),
  jumlah_petugas: z.coerce
    .number()
    .min(1, { message: "Jumlah petugas harus lebih dari 0" }),
  aktif: z.boolean(),
  logo: createImageValidation({ required: false }),
  deskripsi: z.string().optional(),
});

export type FormData = z.infer<typeof formSchema>;
