"use server"

import db from "@/db";
import { access } from "@/db/schema";
import { decrypt } from "@/lib/utils";
import { and, desc, eq } from "drizzle-orm";


export async function getAccessByClientAndProviderId(clientId: number, providerId: number) {
  try {
    const data = await db.query.access.findMany({
      orderBy: [desc(access.id)],
      where: and(eq(access.clientId, clientId), eq(access.providerId, providerId)),
      with: {
        provider: true
      }
    });
    data.map((access) => {
      access.password = proccessPassword(access.password)
    });
    return data;
  } catch (error) {
    console.error("Error al obtener accesos:", error);
    throw error;
  }
}

const proccessPassword = (password: string) => {

  try {
    if (!password.includes(":")) {
      throw new Error("Formato de contraseña inválido");
    }
    const [retrievedEncrypted, retrievedIv] = password.split(":");
    const decryptedPassword = decrypt(retrievedEncrypted, retrievedIv);
    return decryptedPassword;
  } catch (error) {
    console.error(`Error al procesar la contraseña:`, error);
    return '';
  };
}

export async function validateUsername(username: string, providerId: number) {
  try {
    const response = await db.query.access.findFirst({
      where: and(eq(access.username, username), eq(access.providerId, providerId))
    });
    return response ? false : true;
  } catch (error) {
    console.error("Error al validar el email")
  }
}