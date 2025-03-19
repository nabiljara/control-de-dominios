'use server'

import BouncedMail from '@/components/mails/bounced-mail';
import ClientEmail from '@/components/mails/client-mail';
import { NotificationType } from '@/constants';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmailToClient = async (
  domain: string,
  expirationDate: string,
  type: NotificationType,
  email: string,
  expire: 'expired' | 'today' | 'soon',
  primaryColor: '#60C9A1' | '#FF5B5B'
) => {
  try {
    const data = await resend.emails.send({
      from: 'Soporte Kernel <soporte@kerneltech.dev>',
      to: [email],
      subject: 'Vencimiento de dominio.',
      react: ClientEmail({
        domain,
        expirationDate,
        type,
        primaryColor,
        expire,
      }) as React.ReactElement,
    });
    if (!data.error) {
      return { success: true };
    } else {
      throw new Error(
        `Error en Resend: ${data.error.message || 'Error desconocido'}`
      );
    }
  } catch (error) {
    console.error('Error al enviar correo a cliente:', error);
    throw error;
  }
};

export const sendEmailBounced = async (emailTo: string, contactId: number | null) => {
  const managementEmail = 'gerencia@kerneltech.dev'
  try {
    const data = await resend.emails.send({
      from: 'SICOM <soporte@kerneltech.dev>',
      to: [managementEmail],
      subject: 'Email no entregado.',
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

