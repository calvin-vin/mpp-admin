import * as z from "zod";

export const regulationSchema = z.object({
  judul: z.string().min(3, { message: "Judul minimal 3 karakter" }),
  file: z.any().optional(),
  aktif: z.enum(["0", "1"]).default("1"),
});

export type RegulationFormData = z.infer<typeof regulationSchema>;
