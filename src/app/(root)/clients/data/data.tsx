import { Ban, Building, Check, Pause, User, Users } from "lucide-react"

export const statuses = [
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
