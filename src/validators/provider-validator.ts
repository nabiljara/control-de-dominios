import { z } from "zod";

export const providerSchema = z.object({
  name: z
    .string()
    .max(30, { message: "El nombre debe tener como máximo 30 caracteres" })
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  url: z.string().refine((url) => /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(url), {
    message: "URL inválida"
  })
})