"use client";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
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
import { UserNotificationWithRelations } from "@/db/schema";
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

  const filterNotifications = (
    newNotifications: UserNotificationWithRelations[],
  ) => {
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
  };

  useEffect(() => {
    if (!userNotifs || userNotifs.length === 0) return;
    filterNotifications(userNotifs);
  }, [userNotifs]);

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
        <Tabs defaultValue="unread" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="unread">No leídas</TabsTrigger>
            <TabsTrigger value="read">Leídas</TabsTrigger>
          </TabsList>
          <TabsContent value="unread">
            {notifications.unread.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{notification.id}</span>
                  <span className="text-sm text-muted-foreground">
                    {notification.message}
                  </span>
                  <span className="text-sm text-muted-foreground">
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
              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-full"
                onClick={markAllAsRead}
              >
                Marcar todas como leídas
              </Button>
            )}
          </TabsContent>
          <TabsContent value="read">
            {notifications.read.map((notification) => (
              <DropdownMenuItem key={notification.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{notification.id}</span>
                  <span className="text-sm text-muted-foreground">
                    {notification.message}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(notification.createdAt)}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
            {notifications.read.length === 0 && (
              <div className="p-2 text-center text-muted-foreground">
                No hay notificaciones leídas
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
