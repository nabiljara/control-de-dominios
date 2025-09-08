import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
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
  const session = await auth();
  const user = session?.user

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <div className="flex justify-center items-center rounded-lg size-8 aspect-square text-sidebar-primary-foreground">
                  <Image
                    src="/images/logo.png"
                    width={40}
                    height={40}
                    alt='Logo'
                  />
                </div>
                <div className="flex-1 grid text-sm text-left leading-tight">
                  <span className="font-semibold truncate">Control de dominios</span>
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
        <AppSidebarFooter name={user?.name?? ''} email={user?.email ?? ''} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}