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
  PauseCircle,
  Slash,
  LucidePauseCircle
} from "lucide-react"

export const NAV_MAIN = [
  {
    label: "Home",
    href: "/",
    icon: Home,
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
  Chico: { color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80", icon: User },
  Mediano: { color: "bg-green-100 text-green-800 hover:bg-green-100/80" , icon: Users},
  Grande: { color: "bg-red-100 text-red-800 hover:bg-red-100/80" , icon: Building},
} as const;


export const domainStatus = ["Activo", "Vencido", "Dejar vencer", "Baja permanente"] as const
export const clientSize = ["Chico", "Mediano", "Grande"] as const
export const clientStatus = ["Activo", "Inactivo", "Suspendido"] as const
export const contactTypes = [
  "Técnico",
  "Administrativo",
  "Financiero",
  "Comercial",
  "Legal",
  "Operaciones",
  "Logística",
  "Recursos Humanos",
  "Marketing",
  "Ventas",
  "Soporte al Cliente",
  "Proveedor",
  "Consultor",
  "IT / Tecnología",
  "Gerente",
  "Director",
  "CEO / Fundador",
  "CFO (Director Financiero)",
  "COO (Director de Operaciones)",
  "CMO (Director de Marketing)",
  "Partner / Socio Estratégico",
  "Inversionista",
  "Auditor",
  "Capacitador / Coach",
  "Contratista",
] as const;
export const contactStatus = ["Activo", "Inactivo"] as const