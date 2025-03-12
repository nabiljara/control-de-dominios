// import { NotificationType } from '@/constants';
import { getExpiringDomains, updateDomainCron, updateDomainsState } from '@/actions/domains-actions';
import { DomainsByExpiration, ExpiringDomains, NotificationInsert } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';
// import { insertNotification } from '@/actions/notifications-actions';
// import { getClientName } from '@/actions/client-actions';
// import { sendMail } from '@/actions/mail-actions';
// import { getUsers } from '@/actions/user-action/user-actions';
import { createNotificationForDomain } from '@/actions/notifications-actions';
// import { formatTextDate } from '@/lib/utils';

export async function GET(request: NextRequest) {
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return new Response('Unauthorized', {
    //     status: 401,
    //   });
    // }
    console.log("Endpoint api/domains ejecutandose")
    try {
        const today = Date.now();
        const { expiringDomains, expiredDomains } = await getExpiringDomains();
        console.log("dominios obtenidos " + expiringDomains.length, expiredDomains.length)
            

        const domainsByExpiration: DomainsByExpiration = {
            expiringToday: [],
            expiring7days: [],
            expiring30days: []
        };

        expiringDomains.forEach((domain: ExpiringDomains) => {
            const expirationDate = new Date(domain.expirationDate);
            expirationDate.setHours(0, 0, 0, 0);

            const diffInMs = expirationDate.getTime() - today;
            const daysRemaining = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

            if (daysRemaining === 0) {
                domainsByExpiration.expiringToday.push(domain);
            } else if (daysRemaining === 7) {
                domainsByExpiration.expiring7days.push(domain);
            } else if (daysRemaining === 30) {
                domainsByExpiration.expiring30days.push(domain);
            }
        });
        //creación de notificaciones
        try{
            // await Promise.all([
            //     domainsByExpiration.expiring30days.length 
            //         ? createNotificationForDomain(domainsByExpiration.expiring30days, 'Vence en un mes') 
            //         : null,
            //     domainsByExpiration.expiring7days.length 
            //         ? createNotificationForDomain(domainsByExpiration.expiring7days, 'Vence en una semana') 
            //         : null,
            //     domainsByExpiration.expiringToday.length 
            //         ? createNotificationForDomain(domainsByExpiration.expiringToday, 'Vence hoy') 
            //         : null
            // ].filter(Boolean)); 
            if (domainsByExpiration.expiring30days.length) {
                await createNotificationForDomain(domainsByExpiration.expiring30days, 'Vence en un mes');
            }
            else{
                console.log("No hay dominios que venzan en un mes")
            }
            if (domainsByExpiration.expiring7days.length) {
                await createNotificationForDomain(domainsByExpiration.expiring7days, 'Vence en una semana');
            }
            else{
                console.log("No hay dominios que venzan en 7 días")
            }
            if (domainsByExpiration.expiringToday.length) {
                await createNotificationForDomain(domainsByExpiration.expiringToday, 'Vence hoy');
            }
            else{
                console.log("No hay dominios que venzan en el día de hoy")
            }
            console.log("Notificaciones creadas correctamente")
        }catch(error){
            console.error('Error al crear notificaciones:', error);
        }
        try{
            await updateDomainsState(expiredDomains);
            console.log("Dominios actualizados correctamente")
        }catch(error){
            console.error('Error al actualizar el estado de los dominios:', error);
        }

        console.log('Cron Job ejecutado correctamente:', new Date().toLocaleString());
        return NextResponse.json({ success: true },
            { headers: { 'Cache-Control': 'no-store' } }
        );
    } catch (error) {
        console.error('Error en la ejecución del cron job:', error);
        if (error instanceof Error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
        return NextResponse.json({ success: false, error: 'Unknown error' }, { status: 500 });
    }
}




// async function updateDomainsState(doms: ExpiringDomains[]) {
//     for (const dom of doms) {
//         try {
//             await updateDomainCron(dom.id);
//         } catch (error) {
//             console.error(`Error al modificar el estado del dominio ${dom.name}:`, error);
//         }
//     }
//     await createNotificationForDomain(doms, 'Vencido');
// }