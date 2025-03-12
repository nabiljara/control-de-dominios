import { NotificationType } from '@/constants';
import { getExpiringDomains, updateDomainCron, updateDomainsState } from '@/actions/domains-actions';
import { DomainsByExpiration, ExpiringDomains, NotificationInsert } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { insertNotification } from '@/actions/notifications-actions';
// import { getClientName } from '@/actions/client-actions';
// import { sendMail } from '@/actions/mail-actions';
import { getUsers } from '@/actions/user-action/user-actions';
import { createNotificationForDomain } from '@/actions/notifications-actions';
import { formatTextDate } from '@/lib/utils';

export async function GET(request: NextRequest) {
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return new Response('Unauthorized', {
    //     status: 401,
    //   });
    // }
    try {
        const today = Date.now();
        const { expiringDomains, expiredDomains } = await getExpiringDomains();

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

        if (domainsByExpiration.expiring30days.length) {
            await createNotificationForDomain(domainsByExpiration.expiring30days, 'Vence en un mes');
        }
        if (domainsByExpiration.expiring7days.length) {
            await createNotificationForDomain(domainsByExpiration.expiring7days, 'Vence en una semana');
        }
        if (domainsByExpiration.expiringToday.length) {
            await createNotificationForDomain(domainsByExpiration.expiringToday, 'Vence hoy');
        }

        await updateDomainsState(expiredDomains);

        console.log('Cron Job ejecutado correctamente:', new Date().toLocaleString());
        return NextResponse.json({ success: true });
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