"use server"

import db from "@/db";
import { access, AccessInsert, domainAccess, domains } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { setUserId } from "./user-action/user-actions";
import { accessFormSchema, AccessFormValues } from "@/validators/zod-schemas";
import { revalidatePath } from "next/cache";
import crypto from 'crypto';
import { encrypt } from "@/lib/utils";

const SECRET_KEY = process.env.SECRET_KEY || '';

export async function getAccess(id: number) {
  try {
    const data = await db.query.access.findFirst({
      where: eq(access.id, id),
      with: {
        provider: true,
        client: true
      }
    });
    return data;
  } catch (error) {
    console.error("Error al obtener el acceso:", error);
    throw error;
  }
}

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
      access.password = decryptPassword(access.password)
    });
    return data;
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

export async function createAccess(acc: AccessFormValues, pathToRevalidate: string | undefined) {
  let success = false;
  try {
    const parsed = await accessFormSchema.parseAsync(acc);
    if (!parsed) {
      throw new Error("Error de validación del formulario de accesso.");
    }
    const { encrypted, iv } = encrypt(acc.password);

    const newAccess: AccessInsert = {
      username: parsed.username,
      password: `${encrypted}:${iv}`,
      providerId: parseInt(parsed.provider.id),
      clientId: parsed.client && parsed.client.id ? parseInt(parsed.client.id) : null,
      notes: parsed.notes ?? null
    };

    await setUserId()
    await db.insert(access).values(newAccess);
    success = true
  } catch (error) {
    console.error("Error al crear un nuevo acceso", error);
    throw error;
  }
  if (success && pathToRevalidate) {
    revalidatePath(`${pathToRevalidate}`);
  }
}

export async function updateAccess(acc: AccessFormValues, pathToRevalidate: string | undefined, selectedProviders?: Record<number, boolean>) {
  let success = false;
  try {
    const parsed = await accessFormSchema.parseAsync(acc);
    if (!parsed) {
      throw new Error("Error de validación del formulario de acceso.");
    }
    const { encrypted, iv } = encrypt(parsed.password);

    const newAccess: AccessInsert = {
      username: parsed.username,
      password: `${encrypted}:${iv}`,
      providerId: Number(parsed.provider.id),
      clientId: parsed.client && parsed.client.id ? Number(parsed.client.id) : null,
      notes: parsed.notes ?? null
    };

    await db.transaction(async (tx) => {
      if (!parsed.id) {
        throw new Error("El ID del acceso no está definido.");
      }
      await setUserId(tx);
      await tx.update(access).set(newAccess).where(eq(access.id, parsed.id))
      if (selectedProviders) {
        await Promise.all(Object.entries(selectedProviders).map(async ([domainId, updateProvider]) => {
          if (updateProvider) {
            await tx.update(domains)
              .set({ providerId: Number(parsed.provider.id) })
              .where(eq(domains.id, Number(domainId)));
          } else {
            await tx.delete(domainAccess)
              .where(eq(domainAccess.domainId, Number(domainId)));
          }
        }));
      }
    })
    success = true
  } catch (error) {
    console.error("Error al editar el acceso", error);
    throw error;
  }
  if (success && pathToRevalidate) {
    revalidatePath(`${pathToRevalidate}`);
  }
}


export async function deleteAccess(id: number) {
  let success = false;
  try {
    await setUserId()
    await db.delete(access).where(eq(access.id, id));
    success = true;
  } catch (error) {
    console.error("Error al eliminar el acceso:", error);
    throw error;
  }
  if (success) {
    revalidatePath('/clients');
  }
}


export const validateAccess = async (username: string, providerId: number, oldUsername: string | undefined, oldProviderId: number | undefined | null) => {
  try {
    const errorList: { field: "username"; message: string }[] = [];
    const usernameIsValid = await validateUsername(username, providerId);
    if (!usernameIsValid && username !== oldUsername && providerId !== oldProviderId) {
      errorList.push({
        field: "username",
        message: "El usuario o email ya está registrado en el sistema para el proveedor seleccionado.",
      });
    }
    return errorList;
  } catch (error) {
    console.error("Error al validar el acceso del cliente: ", error)
    throw error;
  }
}

export const decryptPassword = (password: string): string => {

  try {
    if (!password.includes(":")) {
      throw new Error("Formato de contraseña inválido");
    }
    const [retrievedEncrypted, retrievedIv] = password.split(":");
    return decrypt(retrievedEncrypted, retrievedIv);
  } catch (error) {
    console.error(`Error al procesar la contraseña:`, error);
    throw error;
  };
}

const decrypt = (encrypted: string, iv: string): string => {
  try {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(SECRET_KEY), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    throw new Error(`Error al descifrar: ${error}`);
  }
};