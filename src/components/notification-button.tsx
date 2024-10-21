'use client'
import { useState } from 'react'
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Notification = {
  id: number;
  title: string;
  date: string;
  description: string;
}

export default function NotificationButton() {
  const [notifications, setNotifications] = useState<{
    unread: Notification[];
    read: Notification[];
  }>({
    unread: [
      { id: 1, title: "Email enviado", date: "Hace 1 hs", description: "Se ha enviado un email a John Doe ya que quedan 30 días para el vencimiento del dominio 'domain.com'." },
      { id: 2, title: "Email no entregado", date: "Hace 2 hs", description: "No se ha entregado correctamente el email a John Doe." },
    ],
    read: [
      { id: 3, title: "Bienvenido", date: "Hace 3 hs", description: "Bienvenido a nuestra plataforma!" },
      { id: 4, title: "Recordatorio", date: "Hace 6 hs", description: "No olvide configurar correctamente el envío de emails." },
    ],
  });

  const markAllAsRead = () => {
    setNotifications(prev => ({
      unread: [],
      read: [...prev.read, ...prev.unread],
    }));
  };

  const unreadCount = notifications.unread.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`Notificaciones: ${unreadCount} nueva${unreadCount !== 1 ? 's' : ''}`}
        >
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
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
              <DropdownMenuItem key={notification.id} className="flex flex-col items-start">
                <div className="flex flex-col">
                  <span className="font-medium">{notification.title}</span>
                  <span className="text-sm text-muted-foreground">{notification.description}</span>
                  <span className="text-sm text-muted-foreground">{notification.date}</span>
                </div>
              </DropdownMenuItem>
            ))}
            {notifications.unread.length === 0 ? (
              <div className="p-2 text-center text-muted-foreground">No hay notificaciones sin leer</div>
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
                  <span className="font-medium">{notification.title}</span>
                  <span className="text-sm text-muted-foreground">{notification.description}</span>
                  <span className="text-sm text-muted-foreground">{notification.date}</span>
                </div>
              </DropdownMenuItem>
            ))}
            {notifications.read.length === 0 && (
              <div className="p-2 text-center text-muted-foreground">No hay notificaciones leídas</div>
            )}
          </TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}