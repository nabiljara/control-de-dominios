import { getActiveDomainsByExpiration, getExpiredActiveDomains, updateDomainsState } from '@/actions/domains-actions';
import { createNotificationForDomains } from '@/actions/notifications-actions';
import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {

    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Endpoint api/domains ejecutándose")

    try {

        const { expiring30days, expiring7days, expiringToday } = await getActiveDomainsByExpiration();
        const expiredDomains = await getExpiredActiveDomains();
        
        try {
            await Promise.allSettled([
                expiring30days.length > 0
                    ? createNotificationForDomains(expiring30days, 'Vence en un mes')
                    : Promise.resolve("Sin dominios para 30 días"),
                expiring7days.length > 0
                    ? createNotificationForDomains(expiring7days, 'Vence en una semana')
                    : Promise.resolve("Sin dominios para 7 días"),
                expiringToday.length > 0
                    ? createNotificationForDomains(expiringToday, 'Vence hoy')
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