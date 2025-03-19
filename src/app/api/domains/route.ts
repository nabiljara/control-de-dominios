import { getExpiringDomains, updateDomainsState } from '@/actions/domains-actions';
import { sendEmailToClient } from '@/actions/mail-actions';
import { createNotificationForDomain } from '@/actions/notifications-actions';
import { DomainsByExpiration, ExpiringDomains } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {

    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    console.log("Endpoint api/domains ejecutandose")

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
        try {
            //ejecuta las promesas en paralelo, para caso de exito o error muestro log 
            await Promise.allSettled([
                domainsByExpiration.expiring30days.length > 0
                    ? createNotificationForDomain(domainsByExpiration.expiring30days, 'Vence en un mes')
                    : Promise.resolve("Sin dominios para 30 días"),
                domainsByExpiration.expiring7days.length > 0
                    ? createNotificationForDomain(domainsByExpiration.expiring7days, 'Vence en una semana')
                    : Promise.resolve("Sin dominios para 7 días"),
                domainsByExpiration.expiringToday.length > 0
                    ? createNotificationForDomain(domainsByExpiration.expiringToday, 'Vence hoy')
                    : Promise.resolve("Sin dominios para hoy"),
                expiredDomains.length > 0 ? updateDomainsState(expiredDomains) : Promise.resolve("Sin dominios expirados")
            ].filter(Boolean)).then(console.log)

        } catch (error) {
            console.error('Error al crear notificaciones y actualizar dominios:', error);
        }
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