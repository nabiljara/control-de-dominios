"use server"

import db from "@/db";
import { access } from "@/db/schema";
import { decrypt } from "@/lib/utils";
import { and, desc, eq } from "drizzle-orm";

export async function getAccesses() {
  try {
    const data = await db.query.access.findMany({
      orderBy: [desc(access.id)],
    });

    const processedData = data.map((access) => {
      try {
        if (!access.password.includes(":")) {
          throw new Error("Formato de contraseña inválido");
        }

        const [retrievedEncrypted, retrievedIv] = access.password.split(":");
        const decryptedPassword = decrypt(retrievedEncrypted, retrievedIv);

        return {
          ...access,
          password: decryptedPassword,
        };
      } catch (error) {
        console.error(`Error al descifrar el acceso ID ${access.id}:`, error);
        return {
          ...access,
          password: null,
        };
      }
    });
    return processedData;
  } catch (error) {
    console.error("Error al obtener accesos:", error);
    throw error;
  }
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