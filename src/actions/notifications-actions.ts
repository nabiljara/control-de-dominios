"use server"
import { auth } from "@/auth";
import { NotificationStatus } from "@/constants";
import db from "@/db";
import { NotificationInsert, notifications, UserNotification, usersNotifications } from "@/db/schema";
import { and, count, desc, eq, ilike } from "drizzle-orm";


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

export async function getUserReadNotificationsFiltered(domainName: string, type: NotificationStatus | 'all') {
  try {
    const session = await auth();
    const id = session?.user?.id;
    if (!id) {
      throw new Error(`El id del usuario no está definido.`);
    }

    const conditions = [
      eq(usersNotifications.userId, id),
      eq(usersNotifications.readed, true),
      ilike(notifications.domainName, `%${domainName}%`)
    ];

    if (type !== 'all') {
      conditions.push(eq(notifications.status, type));
    }


    const data = await db
      .select()
      .from(usersNotifications)
      .innerJoin(notifications, eq(usersNotifications.notificationId, notifications.id))
      .where(and(...conditions))
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