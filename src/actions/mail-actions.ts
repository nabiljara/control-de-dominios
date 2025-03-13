'use server'

import BouncedMail from '@/components/mails/bounced-mail';
import ClientEmail from '@/components/mails/client-mail';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMail(domain:string, expirationDate:string, title:string, primaryColor:string, expire:string) { 
  
  try {
    // const response = await sendEmailToClient(domain, expirationDate,title, primaryColor,expire);

    // if (response.success) {
        return { success: true };
      // }else{
      //   throw new Error("Error inesperado al enviar el correo al cliente");  
      // }
    // } else {
    //   throw new Error("Error inesperado al enviar el correo");
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

const sendEmailToClient = async (domain:string, expirationDate:string, title:string, primaryColor:string, expire:string) => {
  const managementEmail = 'luccamansilla01@gmail.com'
  try {
    const data = await resend.emails.send({
      from: 'Pruebas SICOM <noreply@pruebaslm.online>',
      to: [managementEmail],
      subject: 'Vencimiento de Dominio',
      react: ClientEmail({
        domain,
        expirationDate,
        title,
        primaryColor,
        expire,
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
export async function sendMailBounced(emailTo:string, contactId:number | null) { 
  
  try {
    const response = await sendEmailToManagement(emailTo,contactId);

    if (response.success) {
      return { success: true };
    }else{
        throw new Error("Error inesperado al enviar el correo al cliente");  
      }
    
  } catch (error) {
    console.error("Error al envíar el correo:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error desconocido");
    }
  }
}
const sendEmailToManagement = async (emailTo:string, contactId:number | null) => {
  const managementEmail = 'luccamansilla01@gmail.com'
  try {
    const data = await resend.emails.send({
      from: 'Pruebas SICOM <noreply@pruebaslm.online>',
      to: [managementEmail],
      subject: 'Email no enviado.',
      react: BouncedMail({
        emailTo,
        contactId
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

