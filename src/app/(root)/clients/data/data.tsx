import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons"
import { Ban, Building, Check, Pause, User, Users } from "lucide-react"

export const statuses = [
  {
    value: "active",
    label: "Activo",
    icon: Check,
  },
  {
    value: "inactive",
    label: "Inactivo",
    icon: Pause,
  },
  {
    value: "suspended",
    label: "Suspendido",
    icon: Ban,
  }
]

export const segments = [
  {
    label: "Chica",
    value: "small",
    icon: User,
  },
  {
    label: "Media",
    value: "medium",
    icon: Users,
  },
  {
    label: "Grande",
    value: "large",
    icon: Building,
  },
]
