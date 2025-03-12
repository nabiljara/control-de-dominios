import { insertNotification } from "@/actions/notifications-actions";
import { getUsers } from "@/actions/user-action/user-actions";
import db from "@/db";
import { contacts, NotificationInsert } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await req.json();

    if (!payload?.data?.from || !payload?.data?.to || !Array.isArray(payload.data.to) || payload.data.to.length === 0) {
      return NextResponse.json({ error: "La estructura del payload no es válida" }, { status: 400 });
    }

    if (payload.data.from.includes("soporte@kerneltech.dev") && payload.type === "email.bounced") {
      const emailTo = payload.data.to[0];

      const contact = await db.query.contacts.findFirst({
        where: eq(contacts.email, emailTo),
      });

      const notification: NotificationInsert = {
        message: `No se pudo entregar correctamente el correo de vencimiento a ${emailTo}, revise este contacto y sus dominios asociados.`,
        type: "Email no entregado",
        domainId: contact?.id ?? null,
      };

      const users = await getUsers();
      if (users.length > 0) {
        await Promise.all(users.map((user) => insertNotification(notification, user.id)));
        console.log("Notificaciones creadas para todos los usuarios.");
      }
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error procesando webhook:", error);
    return NextResponse.json({ error: "Error procesando webhook" }, { status: 500 });
  }
}
