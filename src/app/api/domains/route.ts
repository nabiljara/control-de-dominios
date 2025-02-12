import { getExpiringDomains } from '@/actions/domains-actions';
import {  NotificationInsert } from '@/db/schema';
import { NextRequest, NextResponse } from "next/server";
import { insertNotification } from '@/actions/notifications-actions';
import { getClient } from '@/actions/client-actions';
import { sendMail } from '@/actions/mail-actions';

export async function GET(request: NextRequest){
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', {
        status: 401,
      });
    }

    const today = Date.now();
    console.log("Cron Job ejecutado " + new Date().toLocaleString());
    const domains = await getExpiringDomains();
    const domainsByExpiration = {
        expiringToday:[] as typeof domains,
        expiring7days:[] as typeof domains,
        expiring30days:[] as typeof domains
    }
    domains.forEach((domain) => {
        const expirationDate = new Date(domain.expirationDate);
        expirationDate.setHours(0, 0, 0, 0);

        const diffInMs = expirationDate.getTime() - today.valueOf();
        const daysRemaining = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
        if (daysRemaining === 0) {
            domainsByExpiration.expiringToday.push(domain);
          } else if (daysRemaining === 7) {
            domainsByExpiration.expiring7days.push(domain);
          } else if (daysRemaining === 30) {
            domainsByExpiration.expiring30days.push(domain);
          }
    })
    async function createNotificationForDomain(doms: typeof domains, message:string){
        for (const dom of doms) {
            const messageComplete = "El dominio "+ dom.name+ message
            const notification: NotificationInsert = {
                message: messageComplete,
                status: "delivered",
                createdAt: new Date().toISOString(),
            };
    
            try {
                const userId = "21797f94-76ef-48e8-9d75-fed3c00080eb"
                const client = await getClient(dom.clientId)
                const expDate = new Date(dom.expirationDate).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  });
                await insertNotification(notification, userId);
                await sendMail(dom.name, client?.name as string, message, expDate)
                console.log(`Notificación creada para el dominio: ${dom.name}`);
            } catch (error) {
                console.error(`Error al insertar notificación para ${dom.name}:`, error);
            }
        }
    }
    if(domainsByExpiration.expiringToday.length > 0){
        await createNotificationForDomain(domainsByExpiration.expiringToday, " expira hoy")
    }
    if(domainsByExpiration.expiring7days.length > 0){
        await createNotificationForDomain(domainsByExpiration.expiring7days, " expira en 7 días")
    }
    if(domainsByExpiration.expiring30days.length > 0){
        await createNotificationForDomain(domainsByExpiration.expiring30days, " expira en 30 días")
    }
    
    return NextResponse.json({
        success: true,
        expiringDomains: domains,
        expiringToday: domainsByExpiration.expiringToday,
        expiring7days: domainsByExpiration.expiring7days,
        expiring30days: domainsByExpiration.expiring30days,
    });
}
