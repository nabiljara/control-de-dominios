'use client'
import {
  ChevronsUpDown,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,

} from "@/components/ui/sidebar"

import SignoutButton from "@/components/signout-button"
import { getInitials } from "@/lib/utils"

interface AppSidebarFooterProps {
  name: string;
  email: string
}
export default function AppSidebarFooter({ name, email }: AppSidebarFooterProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="rounded-lg w-8 h-8">
                <AvatarFallback className="rounded-lg">{getInitials(name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 grid text-sm text-left leading-tight">
                <span className="font-semibold truncate">
                  {name}
                </span>
                <span className="text-xs truncate">
                  {email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="rounded-lg w-[--radix-dropdown-menu-trigger-width] min-w-56"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-sm text-left">
                <Avatar className="rounded-lg w-8 h-8">
                  <AvatarFallback className="rounded-lg">
                    {getInitials(name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 grid text-sm text-left leading-tight">
                  <span className="font-semibold truncate">
                    {name}
                  </span>
                  <span className="text-xs truncate">
                    {email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <SignoutButton />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
