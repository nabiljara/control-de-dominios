import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import AppSidebarInset from "@/components/app-sidebar-inset";
import { Toaster } from "sonner";
import { cookies } from "next/headers"

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar/>
      <SidebarInset className="overflow-hidden">
        <AppSidebarInset />
        <Toaster richColors closeButton expand={true} position="top-right" />
        <div className="flex flex-col flex-1 mx-auto w-full">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
