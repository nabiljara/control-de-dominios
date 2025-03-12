import { getExpiringDomains, updateDomainCron } from '@/actions/domains-actions';
import { insertNotification } from '@/actions/notifications-actions';
import { getUsers } from '@/actions/user-action/user-actions';
import { DomainsByExpiration, ExpiringDomains, NotificationInsert } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { formatTextDate } from '@/lib/utils';
import { NotificationType } from '@/constants';

export async function GET(request: NextRequest) {
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return new Response('Unauthorized', {
    //     status: 401,
    //   });
    // }
    console.log("Endpoint api/domains ejecutandose")
    //Función para crear notificaciones
    async function createNotificationForDomain(doms: ExpiringDomains[], type: NotificationType, message?: string) {
        for (const dom of doms) {
            try {
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
      
                const users = await getUsers();
                for (const user of users) {
                    await insertNotification(notification, user.id);
                }
      
                // const expDate = new Date(dom.expirationDate).toLocaleDateString("es-ES", {
                //     day: "2-digit",
                //     month: "2-digit",
                //     year: "numeric",
                // });
      
                // await sendMail(dom.name, client?.name || 'Cliente', messageComplete, expDate);
            } catch (error) {
                console.error(`Error al insertar notificación para ${dom.name}:`, error);
            }
        }
      }
    //Función para actualizar el estado de los dominios
    async function updateDomainsState(doms: ExpiringDomains[]) {
          for (const dom of doms) {
              try {
                  await updateDomainCron(dom.id);
              } catch (error) {
                  console.error(`Error al modificar el estado del dominio ${dom.name}:`, error);
              }
          }
          await createNotificationForDomain(doms, 'Vencido');
      }
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
            if (domainsByExpiration.expiring30days.length) {
                await createNotificationForDomain(domainsByExpiration.expiring30days, 'Vence en un mes');
            }
            if (domainsByExpiration.expiring7days.length) {
                await createNotificationForDomain(domainsByExpiration.expiring7days, 'Vence en una semana');
            }
            if (domainsByExpiration.expiringToday.length) {
                await createNotificationForDomain(domainsByExpiration.expiringToday, 'Vence hoy');
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