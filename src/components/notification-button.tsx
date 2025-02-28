"use client";
import { useEffect, useState, useCallback } from "react";
import { Bell, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { UserNotificationWithRelations } from "@/db/schema";
import { formatDate } from "@/lib/utils";
import {
  getUserNotifications,
  markReaded,
} from "@/actions/notifications-actions";

type Notification = {
  id: number;
  status: "delivered" | "bounced";
  createdAt: string;
  message: string;
};

interface NotificationButtonProps {
  userNotifications: UserNotificationWithRelations[];
  userId: string;
}

export default function NotificationButton({
  userNotifications,
  userId,
}: NotificationButtonProps) {
  const [userNotifs, setUserNotifs] = useState(userNotifications);
  const [notifications, setNotifications] = useState<{
    unread: Notification[];
    read: Notification[];
  }>({
    unread: [],
    read: [],
  });

  const [currentPage, setCurrentPage] = useState({
    unread: 1,
    read: 1,
  });
  const itemsPerPage = 5;

  const filterNotifications = useCallback(
    (newNotifications: UserNotificationWithRelations[]) => {
      const unread = newNotifications
        .filter((n) => !n.readed)
        .map((n) => ({
          id: n.notification.id,
          status: n.notification.status,
          createdAt: n.notification.createdAt,
          message: n.notification.message,
        }));

      const read = newNotifications
        .filter((n) => n.readed)
        .map((n) => ({
          id: n.notification.id,
          status: n.notification.status,
          createdAt: n.notification.createdAt,
          message: n.notification.message,
        }));

      setNotifications({ unread, read });
    },
    [],
  );

  useEffect(() => {
    if (!userNotifs || userNotifs.length === 0) return;
    filterNotifications(userNotifs);
  }, [userNotifs, filterNotifications]);

  const markAllAsRead = async () => {
    try {
      await markReaded(userNotifs);
      const updatedNotifications = await getUserNotifications(userId as string);
      setUserNotifs(updatedNotifications);
    } catch (error) {
      console.log("Error al marcar las notificaciones como leídas ", error);
    }
  };

  const unreadCount = notifications.unread.length;

  const getPaginatedNotifications = (type: "unread" | "read") => {
    const startIndex = (currentPage[type] - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return notifications[type].slice(startIndex, endIndex);
  };

  const totalPages = {
    unread: Math.ceil(notifications.unread.length / itemsPerPage),
    read: Math.ceil(notifications.read.length / itemsPerPage),
  };
  const handlePrevPage = (type: "unread" | "read") => {
    if (currentPage[type] > 1) {
      setCurrentPage({
        ...currentPage,
        [type]: currentPage[type] - 1,
      });
    }
  };

  const handleNextPage = (type: "unread" | "read") => {
    if (currentPage[type] < totalPages[type]) {
      setCurrentPage({
        ...currentPage,
        [type]: currentPage[type] + 1,
      });
    }
  };
  const handleTabChange = (value: string) => {
    if (value === "unread" || value === "read") {
      setCurrentPage({
        ...currentPage,
        [value]: 1,
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`Notificaciones: ${unreadCount} nueva${unreadCount !== 1 ? "s" : ""}`}
        >
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Tabs
          defaultValue="unread"
          className="w-full"
          onValueChange={handleTabChange}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="unread">No leídas</TabsTrigger>
            <TabsTrigger value="read">Leídas</TabsTrigger>
          </TabsList>
          <TabsContent value="unread">
            {getPaginatedNotifications("unread").map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{notification.message}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(notification.createdAt)}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
            {notifications.unread.length === 0 ? (
              <div className="p-2 text-center text-muted-foreground">
                No hay notificaciones sin leer
              </div>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={markAllAsRead}
                >
                  Marcar todas como leídas
                </Button>

                {totalPages.unread > 1 && (
                  <div className="mt-2 flex items-center justify-between px-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handlePrevPage("unread")}
                      disabled={currentPage.unread === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      Página {currentPage.unread} de {totalPages.unread}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleNextPage("unread")}
                      disabled={currentPage.unread === totalPages.unread}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
          <TabsContent value="read">
            {getPaginatedNotifications("read").map((notification) => (
              <DropdownMenuItem key={notification.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{notification.message}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(notification.createdAt)}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
            {notifications.read.length === 0 ? (
              <div className="p-2 text-center text-muted-foreground">
                No hay notificaciones leídas
              </div>
            ) : (
              totalPages.read > 1 && (
                <div className="mt-2 flex items-center justify-between px-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePrevPage("read")}
                    disabled={currentPage.read === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    Pág. {currentPage.read} de {totalPages.read}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleNextPage("read")}
                    disabled={currentPage.read === totalPages.read}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )
            )}
          </TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
