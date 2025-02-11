import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
// import NotificationButton from "./notification-button";
import { ModeToggle } from "./mode-toggle";
import AppBreadcrumb from "./app-breadcrumb";
import { CommandShortcut } from "./ui/command";
import { auth } from "@/auth";
import Notifications from "./notifications";

export default function AppSidebarInset() {
  // const session = await auth();
  // const userId = session?.user?.id;

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <div className="flex items-center justify-between">
          <SidebarTrigger className="-ml-1" />
          <CommandShortcut>⌘S</CommandShortcut>
        </div>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <AppBreadcrumb />
      </div>
      <div className="flex items-center gap-2 px-4">
        <Notifications />
        <ModeToggle />
      </div>
    </header>
  );
}
