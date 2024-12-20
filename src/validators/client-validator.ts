import { z } from "zod";

const nameRegex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/;

export const contactSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .max(30, { message: "El nombre debe tener como máximo 30 caracteres." })
    .min(2, { message: "El nombre es obligatorio y debe contener al menos 2 caracteres." })
    .refine((value) => nameRegex.test(value), { message: "El nombre solo puede contener letras." }),

  email: z
    .string()
    .email({ message: "El email no es válido." }).max(30, { message: "El email debe contener como máximo 30 caracteres." }),

  phone: z
    .string()
    .min(11, { message: "El número no es válido." })
    .max(14, { message: "El número no es válido." })
    .optional(),

  status: z.enum(["Activo", "Inactivo"], { message: "El estado del contacto es requerido." }),

  type: z.enum(["Tecnico", "Administrativo", "Financiero"], { message: "El tipo del cliente es requerido." }),

  clientId: z.number().optional()
})

export const accessesSchema = z.object({
  provider: z.object({
    id: z.string({ message: "El proveedor es requerido." }),
    name: z.string({ message: "El proveedor es requerido." }),
  }),
  username: z.string()
    .max(30, { message: "El usuario o email debe tener como máximo 30 caracteres." })
    .min(1, { message: "El usuario o email es requerido." }),
  password: z.string()
    .max(30, { message: "La contraseña debe tener como máximo 30 caracteres." })
    .min(1, { message: "La contraseña es requerida." }),
  notes: z.string()
    .max(100, { message: "Máximo 100 caracteres" })
    .optional(),
  clientId: z.number().optional(),
  providerId: z.number().optional()
})

export const clientFormSchema = z.object({
  name: z.string()
    .max(30, { message: "El nombre debe tener como máximo 30 caracteres." })
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
    .refine((value) => nameRegex.test(value), { message: "El nombre solo puede contener letras." }),

  contacts: z.array(contactSchema).optional(),

  size: z.enum(["Chico", "Medio", "Grande"], { message: "El tamaño del cliente es requerido." }),

  locality: z.object({
    id: z.string({ message: "La localidad es requerida." }),
    name: z.string({ message: "La localidad es requerida." }),
  }),

  status: z.enum(["Activo", "Inactivo", "Suspendido"], { message: "El estado del cliente es requerido." }),

  accesses: z.array(accessesSchema).optional(),
  
})

export const domainFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().url('Nombre de dominio inválido.'),
  provider: z.object({
    id: z.string({ message: "El proveedor es requerido." }),
    name: z.string({ message: "El proveedor es requerido." }),
  }),

  client: z.object({
    id: z.string({ message: "El cliente es requerido." }),
    name: z.string({ message: "El cliente es requerido." }),
  }),

  access: accessesSchema.optional(),
  accessId: z.string().optional(),

  expirationDate: z.date({ message: 'La fecha de vencimiento es requerida.' }),

  status: z.enum(["Activo", "Vencido", "Dejar vencer", 'Baja permanente'], { message: "El estado del dominio es requerido." }),

  contactId: z.string({ message: 'El contacto es requerido.' }),
  contact: contactSchema.optional(),
  isClientContact: z.boolean().optional(),
  isIndividualContact: z.boolean().optional(),
  hasAccess: z.boolean().optional(),
})

export const clientUpdateFormSchema = clientFormSchema.extend({
  domains: z.array(domainFormSchema)
})
export type ClientUpdateValues = z.infer<typeof clientUpdateFormSchema>
export type ClientFormValues = z.infer<typeof clientFormSchema>
export type DomainFormValues = z.infer<typeof domainFormSchema>
export type ContactType = z.infer<typeof contactSchema>
export type AccessType = z.infer<typeof accessesSchema>