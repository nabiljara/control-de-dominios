"use server"

import db from "@/db";
import { access } from "@/db/schema";
import { decrypt, encrypt } from "@/lib/utils";
import { and, desc, eq } from "drizzle-orm";
import { setUserId } from "./user-action/user-actions";
import { AccessType } from "@/validators/client-validator";


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

export async function insertAccess(acc: AccessType, clientId: number) {
  let success = false;
  try {
    await setUserId()
    await db.transaction(async (tx) => {
      const { encrypted, iv } = encrypt(acc.password);
      acc.password = `${encrypted}:${iv}`
      acc.providerId = parseInt(acc.provider.id, 10)
      acc.clientId = clientId
      await tx.insert(access).values(acc); 
      console.log("Contactos agregados correctamente.");
    });
    success = true;
    return success;
  } catch (error) {
    console.error("Error al insertar el acceso:", error);
    throw error;
  }
}