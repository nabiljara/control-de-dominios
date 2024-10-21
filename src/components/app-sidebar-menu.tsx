'use client'
import { NAV_MAIN } from "@/constants";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function AppSidebarMenu() {

  const pathname = usePathname(); 
  return (
    <SidebarMenu>
    {NAV_MAIN.map((item) => (
      <SidebarMenuItem key={item.label}>
        <SidebarMenuButton asChild isActive={pathname === item.href}>
          <Link href={item.href}>
            <item.icon />
            <span>{item.label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ))}
  </SidebarMenu>
  )
}
