import { z } from "zod";
import { validatePhone, validateEmail } from "@/actions/contacts-actions";

const nameRegex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/;

export const contactSchema = z.object({
  name: z
    .string()
    .max(30, { message: "El nombre debe tener como máximo 30 caracteres." })
    .min(2, { message: "El nombre es obligatorio y debe contener al menos 2 caracteres." })
    .refine((value) => nameRegex.test(value), { message: "El nombre solo puede contener letras." }),

  email: z.string().email({ message: "El email no es válido." }).max(30, { message: "El email debe contener como máximo 30 caracteres." }),
  // .refine(
  //   async (email) => await validateEmail(email),
  //   { message: "El correo ya está registrado en el sistema" }
  // ),

  phone: z.string().min(11, { message: "El número no es válido." }).max(14, { message: "El número no es válido." }).optional(),
    // .refine(
    //   async (phone) => await validatePhone(phone as string),
    //   { message: "El teléfono ya está registrado en el sistema" }
    // ),

  status: z.enum(["Activo", "Inactivo"], { message: "El estado del contacto es requerido." }),

  type: z.enum(["Tecnico", "Administrativo", "Financiero"], { message: "El tipo del cliente es requerido y debe ser válido." }),

  clientId: z.number().nullable().optional(),
  client: z
    .object({
      id: z.number(),
      name: z.string().min(1, { message: "El nombre del cliente es obligatorio." }),
    })
    .nullable().optional(),
})
export type ContactType = z.infer<typeof contactSchema>