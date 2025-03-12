"use server"
import { auth } from "@/auth";
import { NotificationType } from "@/constants";
import db from "@/db";
import {  ExpiringDomains, NotificationInsert, notifications, UserNotification, usersNotifications } from "@/db/schema";
import { and, count, desc, eq, ilike, isNull, or } from "drizzle-orm";
import { getUsers } from "./user-action/user-actions";
import { formatTextDate } from '@/lib/utils';


export async function insertNotification(notification: NotificationInsert, userId: string) {
  let success = false;
  try {
    await db.transaction(async (tx) => {
      const response = await tx.insert(notifications).values(notification)
        .returning({ insertedId: notifications.id });

      await tx.insert(usersNotifications).values({
        userId: userId,
        notificationId: response[0].insertedId,
        readed: false
      });
      success = true;
    });

    return success;
  }
  catch (error) {

    console.error("Error al insertar la notificación:", error);
    throw error;
  }
};


export async function getUserUnreadNotifications() {
  try {
    const session = await auth();
    const id = session?.user?.id;
    if (!id) {
      throw new Error(`El id del usuario no está definido.`);
    }

    const data = await db.query.usersNotifications.findMany({
      where: and(eq(usersNotifications.userId, id), eq(usersNotifications.readed, false)),
      with: {
        notification: true
      },
      orderBy: [desc(usersNotifications.notificationId)],
    });
    return data;
  }
  catch (error) {
    console.error("Error al obtener las notificaciones:", error);
    throw error;
  }
};

export async function getUnreadNotificationsCount() {
  try {
    const session = await auth();
    const id = session?.user?.id;
    if (!id) {
      throw new Error(`El id del usuario no está definido.`);
    }

    const result = await db
      .select({ count: count() })
      .from(usersNotifications)
      .where(and(eq(usersNotifications.userId, id), eq(usersNotifications.readed, false)));
    return result[0]?.count || 0;
  }
  catch (error) {
    console.error("Error al obtener la cantidad de notificaciones no leídas:", error);
    throw error;
  }
};

export async function getUserReadNotifications(page: number = 1, limit: number = 30) {
  try {
    const session = await auth();
    const id = session?.user?.id;
    if (!id) {
      throw new Error(`El id del usuario no está definido.`);
    }

    const offset = (page - 1) * limit;

    const data = await db.query.usersNotifications.findMany({
      where: and(eq(usersNotifications.userId, id), eq(usersNotifications.readed, true)),
      with: {
        notification: true
      },
      orderBy: [desc(usersNotifications.notificationId)],
      limit,
      offset
    });

    return data;
  } catch (error) {
    console.error("Error al obtener las notificaciones:", error);
    throw error;
  }
};

export async function getUserReadNotificationsFiltered(domainName: string, type: NotificationType | 'all') {
  try {
    const session = await auth();
    const id = session?.user?.id;
    if (!id) {
      throw new Error(`El id del usuario no está definido.`);
    }

    const conditions = [
      eq(usersNotifications.userId, id),
      eq(usersNotifications.readed, true),
      ilike(notifications.domainName, `%${domainName}%`),
    ];

    if (type !== 'all') {
      conditions.push(eq(notifications.type, type));
    }


    const data = await db
      .select()
      .from(usersNotifications)
      .innerJoin(notifications, eq(usersNotifications.notificationId, notifications.id))
      .where(or(and(...conditions), isNull(notifications.domainName)))
      .orderBy(desc(usersNotifications.notificationId));

    return data;
  } catch (error) {
    console.error("Error al obtener las notificaciones:", error);
    throw error;
  }
};


export async function markNotificationsAsRead(userNotifications: UserNotification[]) {
  try {
    userNotifications.map(async (n) => {
      await db.update(usersNotifications)
        .set({ readed: true })
        .where(eq(usersNotifications.notificationId, n.notificationId));
    })
  }
  catch (error) {
    console.error("Error al actualizar las notificaciones:", error);
    throw error;
  }
};

export async function createNotificationForDomain(doms: ExpiringDomains[], type: NotificationType, message?: string
) {
    try {
        const users = await getUsers();
        if (!users.length) {
            console.log("No hay usuarios para notificar.");
            return;
        }
        const notifications = doms.flatMap((dom) => {
            let messageComplete = `El dominio ${dom.name} `;
            switch (type) {
                case 'Vence hoy':
                    messageComplete += `vence hoy ${formatTextDate(dom.expirationDate)}. Renuévalo ahora para evitar perderlo.`;
                    break;
                case 'Vence en una semana':
                    messageComplete += `vencerá en una semana el ${formatTextDate(dom.expirationDate)}. Considera renovarlo pronto.`;
                    break;
                case 'Vence en un mes':
                    messageComplete += `vencerá en un mes el ${formatTextDate(dom.expirationDate)}. Considera renovarlo pronto.`;
                    break;
                case 'Vencido':
                    messageComplete += `venció el ${formatTextDate(dom.expirationDate)}. Renuévalo ahora para evitar perderlo.`;
                    break;
                case 'Simple':
                    if (!message) throw new Error("Para notificaciones de tipo 'Simple', se debe proporcionar un mensaje.");
                    messageComplete = message;
            }
            const notification: NotificationInsert = {
                message: messageComplete,
                type,
                domainId: dom.id,
                domainName: dom.name,
            };  
            return users.map((user) => insertNotification(notification, user.id));
        });

        const returnMessage = {
          'Vence hoy': 'Dominios que vencen hoy.',
          'Vence en una semana': 'Dominios que vencen en una semana.',
          'Vence en un mes': 'Dominios que vencen en un mes.',
          'Vencido': 'Dominios vencidos.',
          'Email no entregado' : 'Mails no entregados',
          'Simple' : 'Notificaciones simples'
        };
        //ejecución en paralelo de todas las notis
        await Promise.allSettled(notifications);
        return 'Notificaciones creadas correctamente: '+returnMessage[type];
    } catch (error) {
        console.error("Error al insertar notificaciones:", error);
    }
}

