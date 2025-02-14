"use server"
import db from "@/db";
import { NotificationInsert, Notifications, notifications, UserNotification, usersNotifications } from "@/db/schema";
import { desc, eq} from "drizzle-orm";
import { ArrowDownToDotIcon } from "lucide-react";

export async function insertNotification(notification: NotificationInsert, userId:string) {
  let success = false;
  try {
    await db.transaction(async (tx) => {
      const response = await tx.insert(notifications).values({
        message: notification.message,        
        status: notification.status,
        createdAt: notification.createdAt})
        .returning({ insertedId: notifications.id });
        
      const responseUserNotification = await tx.insert(usersNotifications).values({
      userId : userId,
      notificationId: response[0].insertedId,
      readed:false
      });
      success = true;
    });

    return success;
  }
  catch (error) {
    
    console.error("Error al insertar la notificacion:", error);
    throw error;
  }
};


export async function getUserNotifications( userId : string ) {
  try {
    const data = await db.query.usersNotifications.findMany({
      where: eq(usersNotifications.userId, userId),
      with: {
        notification:true
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

export async function markReaded( userNotis : UserNotification[] ) {
  try {
    userNotis.map(async (noti) => {
      await db.update(usersNotifications)
        .set({ readed: true })
        .where(eq(usersNotifications.notificationId, noti.notificationId));
    })
  }
  catch (error) {
    console.error("Error al actualizar las notificaciones:", error);
    throw error;
  }
};