'use client'
import { NAV_MAIN } from "@/constants";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar, } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CommandShortcut } from "./ui/command";
export default function AppSidebarMenu() {
  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "d" && (e.metaKey || e.altKey)) {
        e.preventDefault()
        router.push("/domains")
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [router])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "b" && (e.metaKey || e.altKey)) {
        e.preventDefault()
        router.push("/clients")
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [router])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "p" && (e.metaKey || e.altKey)) {
        e.preventDefault()
        router.push("/providers")
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [router])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "a" && (e.metaKey || e.altKey)) {
        e.preventDefault()
        router.push("/audits")
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [router])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "h" && (e.metaKey || e.altKey)) {
        e.preventDefault()
        router.push("/")
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [router])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "c" && (e.metaKey || e.altKey)) {
        e.preventDefault()
        router.push("/contacts")
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [router])

  const {
    setOpenMobile
  } = useSidebar()
  

  return (
    <SidebarMenu>
      {NAV_MAIN.map((item) => {
        const isActive = item.href === "/"
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
              <Link
                href={item.href}
                onClick={() => {
                  setOpenMobile(false)
                }
                }
              >
                <item.icon />
                <span>{item.label}</span>
                <CommandShortcut>⌘{item.command}</CommandShortcut>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
