import { Ban, Building, Check, Hourglass, Pause, User, Users } from "lucide-react"

export const clientStatus = [
  {
    value: "Activo",
    label: "Activo",
  },
  {
    value: "Inactivo",
    label: "Inactivo",

  },
  {
    value: "Suspendido",
    label: "Suspendido",
  }
]

export const contactStatus = [
  {
    value: "Activo",
    label: "Activo",
    icon: Check,
  },
  {
    value: "Inactivo",
    label: "Inactivo",
    icon: Ban,
  }
]

export const contactTypes = [
  {
    value: "Tecnico",
    label: "Tecnico",
  },
  {
    value: "Administrativo",
    label: "Administrativo",
  },
  {
    value: "Financiero",
    label: "Financiero",
  }
]

export const domainStatus = [
  {
    value: "Activo",
    label: "Activo",
    icon: Check,
  },
  {
    value: "Vencido",
    label: "Vencido",
    icon: Pause,
  },
  {
    value: "Dejar vencer",
    label: "Dejar vencer",
    icon: Hourglass,
  },
  {
    value: "Baja permanente",
    label: "Baja permanente",
    icon: Ban,
  }
]

export const clientSizes = [
  {
    label: "Chico",
    value: "Chico",
  },
  {
    label: "Mediano",
    value: "Mediano",
  },
  {
    label: "Grande",
    value: "Grande",
  },
]

export const auditEntities = [
  {
    value: "Dominios",
    label: "Dominios"
  },
  {
    value: "Clientes",
    label: "Clientes"
  },
  {
    value: "Contactos",
    label: "Contactos"
  },
  {
    value: "Accesos",
    label: "Accesos"
  },
  {
    value: "Proveedores",
    label: "Proveedores"
  },
  {
    value: "Localidades",
    label: "Localidades"
  },
  {
    value: "Usuarios",
    label: "Usuarios"
  },
]
export const auditActions = [
  {
    value: "Agregar",
    label: "Agregar"
  },
  {
    value: "Actualizar",
    label: "Actualizar"
  },
  {
    value: "Eliminar",
    label: "Eliminar"
  }
]
