import { Ban, Building, Check, Hourglass, Pause, User, Users } from "lucide-react"

export const clientStatus = [
  {
    value: "Activo",
    label: "Activo",
    icon: Check,
  },
  {
    value: "Inactivo",
    label: "Inactivo",
    icon: Pause,
  },
  {
    value: "Suspendido",
    label: "Suspendido",
    icon: Ban,
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

export const sizes = [
  {
    label: "Chico",
    value: "Chico",
    icon: User,
  },
  {
    label: "Medio",
    value: "Medio",
    icon: Users,
  },
  {
    label: "Grande",
    value: "Grande",
    icon: Building,
  },
]
