import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import AppSidebarInset from "@/components/app-sidebar-inset";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppSidebarInset />
          <Toaster richColors closeButton expand={true} position="top-right"/>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  );
}
