import {
  AudioWaveform,
  BadgeCheck,
  Bell,
  BookOpen,
  Bot,
  ChevronRight,
  ChevronsUpDown,
  Command,
  CreditCard,
  Folder,
  Forward,
  Frame,
  GalleryVerticalEnd,
  LogOut,
  Map,
  MoreHorizontal,
  PieChart,
  Settings2,
  Sparkles,
  SquareTerminal,
  Trash2,
  Home,
  Globe,
  Users,
  Box
} from "lucide-react"

export const NAV_MAIN = [
    {
      label: "Dashboard",
      href: "/",
      icon: Home,
      items: [
      //   {
      //     label: "Dominios",
      //     href: "/domains",
      //   },
      //   {
      //     label: "Clientes",
      //     href: "/clients",
      //   },
      //   {
      //     label: "Provedores",
      //     href: "/providers",
      //   },
      ],
    },
    {
      label: "Dominios",
      href: "/domains",
      singular: "dominio",
      icon: Globe,
      items: [
      //   {
      //     label: "Genesis",
      //     href: "#",
      //   },
      //   {
      //     label: "Explorer",
      //     href: "#",
      //   },
      //   {
      //     label: "Quantum",
      //     href: "#",
      //   },
      ],
    },
    {
      label: "Clientes",
      href: "/clients",
      icon: Users,
      singular: "cliente",
      items: [
      //   {
      //     label: "Introduction",
      //     href: "#",
      //   },
      //   {
      //     label: "Get Started",
      //     href: "#",
      //   },
      //   {
      //     label: "Tutorials",
      //     href: "#",
      //   },
      //   {
      //     label: "Changelog",
      //     href: "#",
      //   },
      ],
    },
    {
      label: "Provedores",
      href: "/providers",
      icon: Box,
      singular: "provedor",
      items: [
      //   {
      //     label: "General",
      //     href: "#",
      //   },
      //   {
      //     label: "Team",
      //     href: "#",
      //   },
      //   {
      //     label: "Billing",
      //     href: "#",
      //   },
      //   {
      //     label: "Limits",
      //     href: "#",
      //   },
      ],
    },
  ]
  // projects: [
  //   {
  //     name: "Design Engineering",
  //     href: "#",
  //     icon: Frame,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     href: "#",
  //     icon: PieChart,
  //   },
  //   {
  //     name: "Travel",
  //     href: "#",
  //     icon: Map,
  //   },
  // ],
// }