import { z } from "zod";

const nameRegex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/;

export const clientFormSchema = z.object({
  name: z.string().max(30, { message: "El nombre debe tener como máximo 30 caracteres." }).min(2, { message: "El nombre debe tener al menos 2 caracteres." }).refine((value) => nameRegex.test(value), { message: "El nombre solo puede contener letras." }),
  contacts: z.array(z.object({
    name: z.string().max(30, { message: "El nombre debe tener como máximo 30 caracteres." }).min(2, { message: "El nombre debe tener al menos 2 caracteres." }).refine((value) => nameRegex.test(value), { message: "El nombre solo puede contener letras." }),
    email: z.string().email({ message: "El email no es válido." }).max(30, { message: "El email debe contener como máximo 30 caracteres." }),
    phone: z.string().min(11, { message: "El número no es válido." }).max(14, { message: "El número no es válido." }).optional(),
    type: z.enum(["Técnico", "Administrativo"], { message: "El tipo del cliente es requerido." })
  })).optional(),
  size: z.enum(["Chico", "Medio", "Grande"], { message: "El tamaño del cliente es requerido." }),
  locality: z.object({
    id: z.string({ message: "La localidad es requerida." }),
    name: z.string({ message: "La localidad es requerida." }),
  }),
  state: z.enum(["Activo", "Inactivo", "Suspendido"], { message: "El estado del cliente es requerido." }),
  accesses: z.array(z.object({
    provider: z.object({
      id: z.string({ message: "El proveedor es requerido." }),
      name: z.string({ message: "El proveedor es requerido." }),
    }),
    username: z.string().max(30, { message: "El usuario o email debe tener como máximo 30 caracteres." }).min(1, { message: "El usuario o email es requerido." }),
    password: z.string().max(30, { message: "La contraseña debe tener como máximo 30 caracteres." }).min(1, { message: "La contraseña es requerida." }),
    notes: z.string().max(100, { message: "Máximo 100 caracteres" }).optional()
  })).optional()
})

export type ClientFormValues = z.infer<typeof clientFormSchema>
export type ContactType = NonNullable<ClientFormValues['contacts']>[number];
export type AccessType = NonNullable<ClientFormValues['accesses']>[number];