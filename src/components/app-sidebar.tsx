import {
  ChevronRight,
} from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"
import AppSidebarFooter from "./app-sidebar-footer"


import { auth } from "@/auth";

import AppSidebarMenu from "./app-sidebar-menu"

export async function AppSidebar() {
// TODO: CAMBIAR ESTO
  const session = await auth();
  const user = session?.user
  let name = ""
  let email = ""
  if (user && user.name && user && user.email) {
    name = user.name
    email = user.email
  } 
  
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <div className="flex justify-center items-center rounded-lg text-sidebar-primary-foreground aspect-square size-8">
                  <Image
                    src="/images/logo.svg"
                    width={20}
                    height={20}
                    alt='Logo'
                  />
                </div>
                <div className="flex-1 grid text-left text-sm leading-tight">
                  <span className="font-semibold truncate">SICOM</span>
                  <span className="text-xs truncate">Interna y externa</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <AppSidebarMenu/>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <AppSidebarFooter name={name} email={email} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}