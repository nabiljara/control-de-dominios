import {
  BookOpen,
  Home,
  Globe,
  Box,
  Contact,
  Handshake,
  User,
  Users,
  Building,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Ban,
  Slash,
  LucidePauseCircle,
  CalendarArrowDown,
  AlertCircle,
  CalendarClock,
  MailX,
  Bell,
  LayoutDashboard
} from "lucide-react"

export const NAV_MAIN = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    command: "H",
  },
  {
    label: "Dominios",
    href: "/domains",
    singular: "dominio",
    icon: Globe,
    command: "D",
  },
  {
    label: "Clientes",
    href: "/clients",
    icon: Handshake,
    singular: "cliente",
    command: "B",
  },
  {
    label: "Proveedores",
    href: "/providers",
    icon: Box,
    singular: "proveedor",
    command: "P",
  },
  {
    label: "Contactos",
    href: "/contacts",
    icon: Contact,
    singular: "contacto",
    command: "C",
  },
  {
    label: "Auditorias",
    href: "/audits",
    icon: BookOpen,
    singular: "auditoria",
    command: "A",
  },
]

export const entityMap = {
  Proveedores: 'providers',
  Contactos: 'contacts',
  Dominios: 'domains',
  Clientes: 'clients',
  Usuarios: 'users',
  Accesos: 'access',
  Localidades: 'localities',
  "Acceso del dominio": 'domain_access',
};

export const statusConfig = {
  Activo: {
    color: "bg-green-100 text-green-800 hover:bg-green-100/80",
    icon: CheckCircle
  },
  Vencido: {
    color: "bg-red-100 text-red-800 hover:bg-red-100/80",
    icon: XCircle
  },
  "Dejar vencer": {
    color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80",
    icon: AlertTriangle
  },
  "Baja permanente": {
    color: "bg-gray-100 text-gray-800 hover:bg-gray-100/80",
    icon: Ban
  },
  Inactivo: {
    color: "bg-gray-100 text-gray-800 hover:bg-gray-100/80",
    icon: LucidePauseCircle
  },
  Suspendido: {
    color: "bg-red-100 text-red-800 hover:bg-red-100/80",
    icon: Slash
  },
} as const;

export const sizeConfig = {
  Chico: { color: "bg-blue-100 text-blue-800 hover:bg-blue-100/80", icon: User },
  Mediano: { color: "bg-orange-100 text-orange-800 hover:bg-orange-100/80", icon: Users },
  Grande: { color: "bg-purple-100 text-purple-800 hover:bg-purple-100/80", icon: Building },
} as const;


export const notificationStatusConfig = {
  Vencido: {
    icon: CalendarArrowDown,
    iconClassName: "w-5 h-5 text-gray-500",
    badge: "bg-gray-100 text-gray-700",
    text: "text-gray-700",
    border: "border-gray-200",
  },
  'Vence hoy': {
    icon: AlertTriangle,
    iconClassName: "w-5 h-5 text-red-500",
    badge: "bg-red-100 text-red-700",
    text: "text-red-700",
    border: "border-red-200",
  },
  'Vence en una semana': {
    icon: AlertCircle,
    iconClassName: "w-5 h-5 text-yellow-500",
    badge: "bg-yellow-100 text-yellow-700",
    text: "text-yellow-700",
    border: "border-yellow-200",
  },
  'Vence en un mes': {
    icon: CalendarClock,
    iconClassName: "w-5 h-5 text-blue-500",
    badge: "bg-blue-100 text-blue-700",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  'Email no entregado': {
    icon: MailX,
    iconClassName: "w-5 h-5 text-orange-500",
    badge: "bg-orange-100 text-orange-700",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  'Simple': {
    icon: Bell,
    iconClassName: "w-5 h-5 text-gray-500",
    badge: "bg-green-100 text-gray-700",
    text: "text-gray-700",
    border: "border-gray-200",
  }
}

export const domainStatus = ["Activo", "Vencido", "Dejar vencer", "Baja permanente"] as const
export const clientSizes = ["Chico", "Mediano", "Grande"] as const
export const clientStatus = ["Activo", "Inactivo", "Suspendido"] as const
export const contactTypes = [
  "Administrativo",
  "Auditor",
  "Dueño directo",
  "Director financiero",
  "Marketer",
  "Comercial",
  "Asesor",
  "Asistente",
  "Director",
  "Socio Gerente",
  "Coordinador",
  "Jefe de Operaciones",
  "Partner",
  "Proveedor",
  "Recursos Humanos",
  "Soporte",
] as const;
export const contactStatus = ["Activo", "Inactivo"] as const
export const notificationType = ["Vence hoy", "Vence en una semana", "Vence en un mes", "Vencido", "Email no entregado", 'Simple'] as const
export type NotificationType = (typeof notificationType)[number];
export const auditActions = ["Agregar", "Actualizar", "Eliminar"]

export const auditEntities = [
  "Dominios",
  "Clientes",
  "Contactos",
  "Accesos",
  "Proveedores",
  "Localidades",
  "Usuarios",
  "Acceso del dominio"
];