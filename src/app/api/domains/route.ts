import { domainStatus } from './../../../constants/index';
import { getAccessDomain, getExpiringDomains, updateDomain, updateDomainCron } from '@/actions/domains-actions';
import {  NotificationInsert } from '@/db/schema';
import { NextRequest, NextResponse } from "next/server";
import { insertNotification } from '@/actions/notifications-actions';
import { getClient } from '@/actions/client-actions';
import { sendMail } from '@/actions/mail-actions';
import { getUsers } from '@/actions/user-action/user-actions';
export const runtime = 'nodejs';
export async function GET(request: NextRequest){
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', {
        status: 401,
      });
    }

    const today = Date.now();
    console.log("Cron Job ejecutado " + new Date().toLocaleString());
    const { expiringDomains, expiredDomains } = await getExpiringDomains();
    
    const domainsByExpiration = {
        expiringToday:[] as typeof expiringDomains,
        expiring7days:[] as typeof expiringDomains,
        expiring30days:[] as typeof expiringDomains
    }
    //Separo dominios por proximidad a vencer
    expiringDomains.forEach((domain) => {
        const expirationDate = new Date(domain.expirationDate);
        expirationDate.setHours(0, 0, 0, 0);

        const diffInMs = expirationDate.getTime() - today.valueOf();
        const daysRemaining = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
        // console.log(domain.name + " vence en "+daysRemaining+" días")
        if (daysRemaining === 0) {
            domainsByExpiration.expiringToday.push(domain);
          } else if (daysRemaining === 7) {
            domainsByExpiration.expiring7days.push(domain);
          } else if (daysRemaining === 30) {
            domainsByExpiration.expiring30days.push(domain);
          }
    })
    
    //Creación de notificación para cada dominio
    async function createNotificationForDomain(doms: typeof expiringDomains, message:string){
        for (const dom of doms) {
            const messageComplete = "El dominio "+ dom.name+ message
            const notification: NotificationInsert = {
                message: messageComplete,
                status: "delivered",
                createdAt: new Date().toISOString(),
            };
    
            try {
                const users = await getUsers()
                const client = await getClient(dom.clientId)
                for (const user of users){
                    await insertNotification(notification, user.id);
                }
                const expDate = new Date(dom.expirationDate).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  });
                await sendMail(dom.name, client?.name as string, message, expDate)
            } catch (error) {
                console.error(`Error al insertar notificación para ${dom.name}:`, error);
            }
        }
    }
    //Modifica estado de los dominios vencidos y se crea modificación para c/u
    async function updateDomainsState(doms: typeof expiredDomains){
        for (const dom of doms) {
            try{
                //Modifica estado dominio
                const updatedDomain = { ...dom, status: "Vencido" as (typeof domainStatus)[number]};
                await updateDomainCron(updatedDomain);
            }
            catch(error){
                console.log("Error al modificar el estado del dominio: ", error)
            }
        }
        //Crea notificaciones para todos los dominios vencidos
        await createNotificationForDomain(doms, " venció")
    }
    
    //Notificaciones segun proximidad a vencer
    if(domainsByExpiration.expiringToday.length > 0){
        await createNotificationForDomain(domainsByExpiration.expiring7days, " expira hoy")
    }
    if(domainsByExpiration.expiring7days.length > 0){
        await createNotificationForDomain(domainsByExpiration.expiring7days, " expira en 7 días")
    }
    if(domainsByExpiration.expiring30days.length > 0){
        await createNotificationForDomain(domainsByExpiration.expiring30days, " expira en 30 días")
    }
    //Cambio los estados de los dominios ya vencidos
    await updateDomainsState(expiredDomains);
    
    return NextResponse.json({
        success: true
    });
}
