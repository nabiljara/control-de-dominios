'use server'

import ClientEmail from '@/components/mails/client-mail';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMail(domain:string, client:string, days:string, expirationDate:string) { 
  
  try {
    // const response = await sendEmailToClient(domain, client, days, expirationDate);

    // if (response.success) {
    //   const responseClient = await sendEmailToClient(data);
    //   if (responseClient.success){
        return { success: true };
    //   }else{
    //     throw new Error("Error inesperado al enviar el correo al cliente");  
    //   }
    // } else {
      // throw new Error("Error inesperado al enviar el correo");
    // }
  } catch (error) {
    console.error("Error al envíar el correo:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error desconocido");
    }
  }
}


const sendEmailToClient = async (domain:string, client:string, days:string, expirationDate:string) => {
  const managementEmail = 'luccamansilla01@gmail.com'
  try {
    const data = await resend.emails.send({
      from: 'Pruebas SICOM <noreply@pruebaslm.online>',
      to: [managementEmail],
      subject: 'Vencimiento de Dominio',
      react: ClientEmail({
          client,
        domain,
        days,
        expirationDate
      }) as React.ReactElement,
    });
    if (!data.error) {
      return { success: true };
    }
    else {
      throw new Error(
        `Error en Resend: ${data.error.message || "Error desconocido"}`
      );
    }
  } catch (error) {
    console.error("Error al enviar correo a cliente:", error);
    throw error;
  }
}