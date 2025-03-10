import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "./mode-toggle";
import AppBreadcrumb from "./app-breadcrumb";
import { CommandShortcut } from "./ui/command";
import { NotificationsSheet } from "./notifications-sheet";
import { getUnreadNotificationsCount } from "@/actions/notifications-actions";
export default async function AppSidebarInset() {
  const unreadCount = await getUnreadNotificationsCount();
  return (
    <header className="group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 flex justify-between items-center gap-2 h-16 transition-[width,height] ease-linear shrink-0">
      <div className="flex items-center gap-2 px-4">
        <div className="flex justify-between items-center">
          <SidebarTrigger className="-ml-1" />
          <CommandShortcut>⌘S</CommandShortcut>
        </div>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <AppBreadcrumb />
      </div>
      <div className="flex items-center gap-2 px-4">
        <NotificationsSheet unreadNotificationsCount={unreadCount} />
        <ModeToggle />
      </div>
    </header>
  );
}
