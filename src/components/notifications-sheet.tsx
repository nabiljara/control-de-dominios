"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Search, Loader2, ChevronUp, Database, Check, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { NotificationType, notificationType, notificationStatusConfig } from "@/constants";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUnreadNotificationsCount, getUserReadNotifications, getUserReadNotificationsFiltered, getUserUnreadNotifications, markNotificationsAsRead } from "@/actions/notifications-actions";
import NotificationSkeleton from "./notification-skeleton";
import { NotificationCard } from "./notification-card";
import { UserNotificationWithRelations } from "@/db/schema";
import { toast } from "sonner";


export function NotificationsSheet() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [readNotifications, setReadNotifications] = useState<UserNotificationWithRelations[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState<UserNotificationWithRelations[]>([]);
  const [isLoadingUnread, setIsLoadingUnread] = useState(false);
  const [isLoadingRead, setIsLoadingRead] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [errorRead, setErrorRead] = useState(false);
  const [errorUnread, setErrorUnread] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [tabSelectedOnce, setTabSelectedOnce] = useState(false);
  const [tabSelected, setTabSelected] = useState('unread');
  const [isMarkNotificationLoading, setIsMarkNotificationLoading] = useState(false);
  const [errorMarkNotification, setErrorMarkNotification] = useState(false);
  const [refreshUnread, setRefreshUnread] = useState(false);
  const limit = 30;
  const sheetContentRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    if (sheetContentRef.current) {
      sheetContentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const fetchUnreadNotificationsCount = async () => {
      try {
        const count = await getUnreadNotificationsCount();
        setUnreadCount(count);
      } catch (error) {
        toast.error('No se pudo actualizar correctamente las notificaciones. Refrescar manualmente.')
      }
    }
    fetchUnreadNotificationsCount();

  }, []);

  ;
  //Buscar las notificaciones leídas
  useEffect(() => {

    const fetchReadNotifications = async () => {
      if (tabSelectedOnce && page !== 0) {
        try {
          setIsLoadingRead(true)
          const notifications = await getUserReadNotifications(page, limit);
          setErrorRead(false);
          if (notifications.length < limit) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
          if (page === 1) {
            setReadNotifications(notifications);
          } else {
            setReadNotifications(prev => [...prev, ...notifications]);
          }
        } catch (error) {
          setErrorRead(true)
        } finally {
          setIsLoadingRead(false)
        }
      }
    };
    fetchReadNotifications();

  }, [page, tabSelectedOnce]);

  //Buscar las notificaciones no leídas
  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      if (open) {
        try {
          setIsLoadingUnread(true)
          const notifications = await getUserUnreadNotifications();
          setErrorUnread(false)
          setUnreadNotifications(notifications);
          setUnreadCount(notifications.length)
        } catch (error) {
          setErrorUnread(true)
        } finally {
          setIsLoadingUnread(false)
        }
      }
    };
    fetchUnreadNotifications();
  }, [open, refreshUnread]);

  //Buscar por filtro en la base de datos
  const handleFetchDBData = async () => {
    setIsLoadingRead(true);
    try {
      const notifications = await getUserReadNotificationsFiltered(searchQuery, typeFilter as NotificationType);
      setReadNotifications(notifications.map(n => ({
        ...n.users_notifications,
        notification: n.notifications
      })));
      setHasMore(false);
      setPage(0)
    } catch (error) {
      setErrorRead(true)
    } finally {
      setIsLoadingRead(false);
    }
  };

  // Filtrar notificaciones no leídas
  const filteredUnreadNotifications = useMemo(() => {
    return unreadNotifications && unreadNotifications.filter((n) => {
      return (
        (!searchQuery || (n.notification.domainName && n.notification.domainName.toLowerCase().includes(searchQuery.toLowerCase()))) &&
        (typeFilter === "all" || n.notification.type === typeFilter)
      );
    });
  }, [unreadNotifications, searchQuery, typeFilter]);

  // Filtrar notificaciones leídas
  const filteredReadNotifications = useMemo(() => {
    return readNotifications && readNotifications.filter((n) => {
      return (
        (!searchQuery || (n.notification.domainName && n.notification.domainName.toLowerCase().includes(searchQuery.toLowerCase()))) &&
        (typeFilter === "all" || n.notification.type === typeFilter)
      );
    });
  }, [readNotifications, searchQuery, typeFilter]);


  //Marcar notificaciones como leídas
  const handleMarkNotificationAsRead = async () => {
    setIsMarkNotificationLoading(true);
    try {
      await markNotificationsAsRead(unreadNotifications);
      setUnreadNotifications([])
      setUnreadCount(0)
      if (tabSelectedOnce) { //Actualizar la pestaña de leídas
        const notifications = await getUserReadNotifications();
        setReadNotifications(notifications)
      }
    } catch (error) {
      setErrorMarkNotification(true)
    } finally {
      setIsMarkNotificationLoading(false);
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setTabSelected('unread')
        }
      }}
    >
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="-top-0 -right-1 absolute flex justify-center items-center bg-red-500 rounded-full w-4 h-4 font-medium text-[10px] text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="flex flex-col gap-4 w-full sm:max-w-lg min-h-screen overflow-y-scroll" ref={sheetContentRef}>

        <SheetHeader className="px-4 py-3">
          <SheetTitle className="font-semibold text-lg">Notificaciones</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col items-start gap-3 mt-4 px-4">
          <Label>Nombre de dominio</Label>
          <div className="relative flex-1 w-full">
            <Search className="top-1/2 left-2 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
            <Input
              placeholder="Ej: https://kerneltech.dev"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 px-4">
          <Label>Tipo de notificación</Label>
          <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Todos los tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <Badge variant="outline">Todas</Badge>
              </SelectItem>
              {notificationType.map((notification) => (
                <SelectItem value={notification} key={notification}>
                  <Badge variant="outline" className={notificationStatusConfig[notification].badge}>
                    {notification}
                  </Badge>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {
          tabSelected === 'read' &&
          <div className="flex flex-col items-start gap-2 px-4">
            <div className="flex justify-between items-center gap-2 w-full">
              <Button
                className="w-full"
                size='sm'
                variant="outline"
                onClick={handleFetchDBData}
                disabled={isLoadingRead}
              >
                {isLoadingRead ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" /> Buscando...
                  </div>
                ) : (
                  <>
                    <Database />
                    Filtrar por base de datos
                  </>
                )}
              </Button>
              <Button
                className="w-full"
                size='sm'
                variant="outline"
                onClick={() => {
                  setTypeFilter('all')
                  setSearchQuery('')
                  setPage(1)
                }}
                disabled={isLoadingRead}
              >
                {isLoadingRead ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" /> Buscando...
                  </div>
                ) : (
                  <>
                    <RefreshCw />
                    {`Traer últimas ${limit}`}
                  </>
                )}
              </Button>
            </div>
            <span className="text-muted-foreground text-xs">Presiona luego de elegir los filtros para realizar el filtrado por base de datos, de no ser así se realizará con las notificaciones actuales.</span>
          </div>
        }


        <Tabs defaultValue="unread" className="flex flex-col items-center gap-2 w-full">
          <TabsList className="w-[94%]">
            <TabsTrigger value="unread" className="w-full" onClick={() => setTabSelected('unread')}>No leídas</TabsTrigger>
            <TabsTrigger value="read" className="w-full" onClick={() => {
              setTabSelected('read')
              if (!tabSelectedOnce) setTabSelectedOnce(true)
            }}
            >
              Leídas
            </TabsTrigger>
          </TabsList>
          <TabsContent value="unread" className="w-full">
            <div className="flex flex-col justify-between gap-2 px-4 py-2">
              <div className="flex justify-between items-center gap-2">
                <p className="text-muted-foreground text-sm">
                  {filteredUnreadNotifications && filteredUnreadNotifications.length} {filteredUnreadNotifications && filteredUnreadNotifications.length === 1 ? "resultado" : "resultados"}
                </p>
                <div className="flex gap-2">

                  {unreadCount > 0 &&
                    <Button
                      className="w-fit"
                      size='sm'
                      variant="outline"
                      onClick={handleMarkNotificationAsRead}
                      disabled={isMarkNotificationLoading}
                    >
                      {isMarkNotificationLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="animate-spin" /> Marcando como leídas...
                        </div>
                      ) : (
                        <>
                          <Check />
                          Marcar como leídas
                        </>
                      )}
                    </Button>
                  }
                  <Button
                    className="w-fit"
                    size='sm'
                    variant="outline"
                    onClick={() => setRefreshUnread(!refreshUnread)}
                    disabled={isLoadingUnread}
                  >
                    {isLoadingUnread ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="animate-spin" />
                      </div>
                    ) : (
                      <RefreshCw />
                    )}
                  </Button>
                </div>

              </div>
              {errorMarkNotification && <span className="text-destructive text-xs">Hubo un error al marcar las notificaciones como leídas.</span>}
            </div>

            {/* NOTIFICACIONES NO LEÍDAS */}
            <div className="space-y-3 px-4">
              {isLoadingUnread && <NotificationSkeleton />}
              {errorUnread &&
                <div className="py-8 text-center">
                  <p className="text-destructive">Hubo un error al intentar recuperar las notificaciones. Por favor intente nuevamente más tarde</p>
                </div>
              }

              {!errorUnread && filteredUnreadNotifications && filteredUnreadNotifications.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No se encontraron notificaciones</p>
                </div>
              ) : (
                filteredUnreadNotifications && filteredUnreadNotifications.map((n) => {
                  return (
                    <NotificationCard key={n.notification.id} notification={n.notification} isUnread={n.readed} />
                  );
                })
              )}
            </div>
          </TabsContent>
          <TabsContent value="read" className="w-full">
            <div className="px-4 py-2">
              <p className="text-muted-foreground text-sm">
                {filteredReadNotifications && filteredReadNotifications.length !== undefined ? filteredReadNotifications.length : 0} {filteredReadNotifications && filteredReadNotifications.length === 1 ? "resultado" : "resultados"}
              </p>
            </div>
            {/* NOTIFICACIONES LEÍDAS */}

            <div className="space-y-3 px-4">
              {errorRead &&
                <div className="py-8 text-center">
                  <p className="text-destructive">Hubo un error al intentar recuperar las notificaciones. Por favor intente nuevamente más tarde</p>
                </div>
              }

              {!errorRead && !isLoadingRead && filteredReadNotifications && filteredReadNotifications.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No se encontraron notificaciones</p>
                </div>
              ) : (
                filteredReadNotifications && filteredReadNotifications.map((n) => {
                  return (
                    <NotificationCard key={n.notification.id} notification={n.notification} isUnread={n.readed} />
                  )
                })
              )}
              {isLoadingRead && <NotificationSkeleton />}
              {errorRead && filteredReadNotifications.length > 8 &&
                <div className="py-8 text-center">
                  <p className="text-destructive">Hubo un error al intentar recuperar las notificaciones. Por favor intente nuevamente más tarde</p>
                </div>
              }
              {hasMore && filteredReadNotifications.length !== 0 && (
                <Button
                  onClick={() => { setPage(prev => prev + 1); }}
                  disabled={isLoadingRead}
                  className="w-full"
                  size='sm'
                >
                  {isLoadingRead ? (
                    <div className="flex items-center gap-1">
                      <Loader2 className="animate-spin" />
                      Cargando más notificaciones
                    </div>
                  ) : (
                    'Cargar más notificaciones'
                  )}
                </Button>
              )}
              {
                filteredReadNotifications.length > 10 &&
                <Button
                  onClick={scrollToTop}
                  className="right-4 bottom-6 z-50 fixed w-8 h-9"
                  size='sm'
                >
                  <ChevronUp />
                </Button>
              }
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}