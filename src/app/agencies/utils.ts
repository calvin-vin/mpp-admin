import * as z from "zod";
import { createImageValidation } from "@/utils/helpers";

export const formSchema = z.object({
  instansi: z.string().min(2, { message: "Nama instansi minimal 2 karakter" }),
  nickname: z
    .string()
    .min(2, { message: "Akronim instansi minimal 2 karakter" }),
  kode: z.string().min(2, { message: "Kode instansi minimal 2 karakter" }),
  no_tenant: z.preprocess(
    (val) => String(val),
    z.string().min(1, { message: "Nomor tenant harus diisi" })
  ),
  jumlah_petugas: z.coerce
    .number()
    .min(1, { message: "Jumlah petugas harus lebih dari 0" }),
  aktif: z.boolean(),
  logo: createImageValidation({ required: false }),
});

export type FormData = z.infer<typeof formSchema>;
