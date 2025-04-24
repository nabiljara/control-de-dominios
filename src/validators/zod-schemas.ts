import { clientSizes, clientStatus, contactStatus, contactTypes, domainStatus } from "@/constants";
import { z } from "zod";

const nameRegex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/;

export const providerSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .max(30, { message: "El nombre debe tener como máximo 30 caracteres." })
    .min(2, { message: "El nombre es obligatorio y debe contener al menos 2 caracteres." })
    .refine((value) => nameRegex.test(value), { message: "El nombre solo puede contener letras." }),

  url: z
    .string()
    .url({ message: "URL inválida." })

})

export const contactFormSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .trim()
    .max(60, { message: "El nombre debe tener como máximo 60 caracteres." })
    .min(2, { message: "El nombre es obligatorio y debe contener al menos 2 caracteres." })
    .refine((value) => nameRegex.test(value), { message: "El nombre solo puede contener letras." }),

  email: z
    .string()
    .trim()
    .email({ message: "El email no es válido." }).max(50, { message: "El email debe contener como máximo 50 caracteres." })
    .transform((val) => val.toLowerCase()),

  phone: z
    .string()
    .trim()
    .min(11, { message: "El número no es válido." })
    .max(15, { message: "El número no es válido." })
    .optional(),

  status: z.enum(contactStatus, { message: "El estado del contacto es requerido." }),

  type: z.enum(contactTypes, { message: "El tipo del cliente es requerido." }),

  clientId: z.number().optional()
})


export const accessFormSchema = z.object({
  id: z.number().optional(),
  provider: z.object({
    id: z.string({ message: "El proveedor es requerido." }),
    name: z.string({ message: "El proveedor es requerido." }),
  }),
  username: z
    .string()
    .trim()
    .max(50, { message: "El usuario o email debe tener como máximo 50 caracteres." })
    .min(1, { message: "El usuario o email es requerido." }),
  password:
    z.string()
      .trim()
      .max(30, { message: "La contraseña debe tener como máximo 30 caracteres." })
      .min(1, { message: "La contraseña es requerida." }),
  notes: z
    .string()
    .trim()
    .max(300, { message: "Máximo 300 caracteres." })
    .optional(),
  client: z.object({
    id: z.string().optional(),
    name: z.string().optional(),
  }).optional(),
})

export const clientFormSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .trim()
    .max(40, { message: "El nombre debe tener como máximo 40 caracteres." })
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." }),

  contacts: z.array(contactFormSchema).optional(),

  size: z.enum(clientSizes, { message: "El tamaño del cliente es requerido." }),

  locality: z.object({
    id: z.string({ message: "La localidad es requerida." }),
    name: z.string({ message: "La localidad es requerida." }),
  }),

  status: z.enum(clientStatus, { message: "El estado del cliente es requerido." }),

  access: z.array(accessFormSchema).optional(),

})

export const domainFormSchema = z.object({
  id: z.number().optional(),

  name: z.preprocess((input) => {
    if (typeof input === "string") {
      const trimmed = input.trim();
      if (!/^https?:\/\//i.test(trimmed)) {
        return `https://${trimmed}`;
      }
      return trimmed;
    }
    return input;
  }, z.string()
    .url('Nombre de dominio inválido.')
    .max(100, { message: "Máximo 100 caracteres" })
  ),

  provider: z.object({
    id: z.string({ message: "El proveedor es requerido." }),
    name: z.string({ message: "El proveedor es requerido." }),
  }),

  client: z.object({
    id: z.string({ message: "El cliente es requerido." }),
    name: z.string({ message: "El cliente es requerido." }),
  }),

  access: accessFormSchema.optional(),
  accessId: z.number().optional(),

  expirationDate: z.date({ message: 'La fecha de vencimiento es requerida.' }),

  status: z.enum(domainStatus, { message: "El estado del dominio es requerido." }),
  notes: z
  .string()
  .trim()
  .max(1000, { message: "Máximo 1000 caracteres." })
  .optional(),
  contactId: z.string({ message: 'El contacto es requerido.' }),
  contact: contactFormSchema.optional(),
  isClientContact: z.boolean().optional(),
  isKernelContact: z.boolean().optional(),
  isIndividualContact: z.boolean().optional(),
  isClientAccess: z.boolean().optional(),
  isKernelAccess: z.boolean().optional(),
})

export const clientUpdateFormSchema = clientFormSchema.omit({
  access: true,
  contacts: true,
}).extend({
  domains: z.array(domainFormSchema.pick({
    id: true,
    client: true,
    status: true,
    name: true,
    contactId: true,
    accessId: true,
    provider: true,
    expirationDate: true
  })).optional()
})
export type ClientUpdateValues = z.infer<typeof clientUpdateFormSchema>
export type ClientFormValues = z.infer<typeof clientFormSchema>
export type DomainFormValues = z.infer<typeof domainFormSchema>
export type ContactFormValues = z.infer<typeof contactFormSchema>
export type AccessFormValues = z.infer<typeof accessFormSchema>
export type ProviderFormValues = z.infer<typeof providerSchema>