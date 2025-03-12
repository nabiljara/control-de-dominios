import { getExpiringDomains, updateDomainCron } from '@/actions/domains-actions';
import { insertNotification } from '@/actions/notifications-actions';
import { getUsers } from '@/actions/user-action/user-actions';
import { DomainsByExpiration, ExpiringDomains, NotificationInsert } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { formatTextDate } from '@/lib/utils';
import { NotificationType } from '@/constants';

export async function POST(request: NextRequest) {
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return new Response('Unauthorized', {
    //     status: 401,
    //   });
    // }
    console.log("Endpoint api/domains ejecutandose")
    //Función para crear notificaciones
    async function createNotificationForDomain(doms: ExpiringDomains[], type: NotificationType, message?: string
    ) {
        try {
            const users = await getUsers();
    
            if (!users.length) {
                console.log("No hay usuarios para notificar.");
                return;
            }
    
            const notifications = doms.flatMap((dom) => {
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
    
                return users.map((user) => insertNotification(notification, user.id));
            });

            //ejecución en paralelo de todas las notis
            await Promise.allSettled(notifications);
            // console.log(`Notificaciones creadas para ${doms.length} dominios.`);
        } catch (error) {
            console.error("Error al insertar notificaciones:", error);
        }
    }
    // async function createNotificationForDomain(doms: ExpiringDomains[], type: NotificationType, message?: string) {
    //     const users = await getUsers();
    //     for (const dom of doms) {
    //         try {
    //             let messageComplete = `El dominio ${dom.name} `;
    //             switch (type) {
    //                 case 'Vence hoy':
    //                     messageComplete += `vence hoy ${formatTextDate(dom.expirationDate)}. Renuévalo ahora para evitar perderlo.`;
    //                     break;
    //                 case 'Vence en una semana':
    //                     messageComplete += `vencerá en una semana el ${formatTextDate(dom.expirationDate)}. Considera renovarlo pronto.`;
    //                     break;
    //                 case 'Vence en un mes':
    //                     messageComplete += `vencerá en un mes el ${formatTextDate(dom.expirationDate)}. Considera renovarlo pronto.`;
    //                     break;
    //                 case 'Vencido':
    //                     messageComplete += `venció el ${formatTextDate(dom.expirationDate)}. Renuévalo ahora para evitar perderlo.`;
    //                     break;
    //                 case 'Simple':
    //                     if (!message) throw new Error("Para notificaciones de tipo 'Simple', se debe proporcionar un mensaje.");
    //                     messageComplete = message;
    //             }
      
    //             const notification: NotificationInsert = {
    //                 message: messageComplete,
    //                 type,
    //                 domainId: dom.id,
    //                 domainName: dom.name,
    //             };
    //             for (const user of users) {
    //                 await insertNotification(notification, user.id);
    //             }
      
    //             // const expDate = new Date(dom.expirationDate).toLocaleDateString("es-ES", {
    //             //     day: "2-digit",
    //             //     month: "2-digit",
    //             //     year: "numeric",
    //             // });
      
    //             // await sendMail(dom.name, client?.name || 'Cliente', messageComplete, expDate);
    //         } catch (error) {
    //             console.error(`Error al insertar notificación para ${dom.name}:`, error);
    //         }
    //     }
    //   }
    //Función para actualizar el estado de los dominios
    // async function updateDomainsState(doms: ExpiringDomains[]) {
    //       for (const dom of doms) {
    //           try {
    //               await updateDomainCron(dom.id);
    //           } catch (error) {
    //               console.error(`Error al modificar el estado del dominio ${dom.name}:`, error);
    //           }
    //       }
    //       await createNotificationForDomain(doms, 'Vencido');
    //   }
    //aplico misma logica que las notificaciones
    async function updateDomainsState(doms: ExpiringDomains[]) {
        try {
            await Promise.all(doms.map(async (dom) => {
                try {
                    await updateDomainCron(dom.id);
                } catch (error) {
                    console.error(`Error al modificar el estado del dominio ${dom.name}:`, error);
                }
            }));
            await createNotificationForDomain(doms, 'Vencido');
        } catch (error) {
            console.error('Error al actualizar el estado de los dominios:', error);
        }
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
        try{
            await Promise.allSettled([
                domainsByExpiration.expiring30days.length > 0 
                // ? console.log("Acción creación notificaciones para dominios que vencen en un mes")
                ? createNotificationForDomain(domainsByExpiration.expiring30days, 'Vence en un mes') 
                : null,
                domainsByExpiration.expiring7days.length > 0 
                // ? console.log("Acción creación notificaciones para dominios que vencen en una semana")
                ? createNotificationForDomain(domainsByExpiration.expiring7days, 'Vence en una semana') 
                : null,
                domainsByExpiration.expiringToday.length > 0 
                // ? console.log("Acción creación notificaciones para dominios que vencen hoy")
                ? createNotificationForDomain(domainsByExpiration.expiringToday, 'Vence hoy') 
                : null,
                expiredDomains.length > 0 ? updateDomainsState(expiredDomains) : null
            ].filter(Boolean))
            // if (domainsByExpiration.expiring30days.length) {
            // }
            // if (domainsByExpiration.expiring7days.length) {
            // }
            // if (domainsByExpiration.expiringToday.length) {
            // }
            console.log("Notificaciones creadas correctamente")
            console.log("Estados de los dominios actualizados")

        }catch(error){
            console.error('Error al crear notificaciones y actualizar dominios:', error);
        }
        // try{
        //     await updateDomainsState(expiredDomains);
        //     console.log("Dominios actualizados correctamente")
        // }catch(error){
        //     console.error('Error al actualizar el estado de los dominios:', error);
        // }

        console.log('Cron Job ejecutado correctamente:', new Date().toLocaleString());
        return NextResponse.json({ success: true });
    } catch (error) {
        console.log('Error en la ejecución del cron job:', error);
        if (error instanceof Error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
        return NextResponse.json({ success: false, error: 'Unknown error' }, { status: 500 });
    }
}