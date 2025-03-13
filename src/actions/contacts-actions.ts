"use server"
import db from "@/db";
import { contacts, Contact, ContactWithRelations, ContactInsert, domains } from "@/db/schema";
import { desc, eq, or, isNull, and, sql } from "drizzle-orm";
import { setUserId } from "./user-action/user-actions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { contactFormSchema, ContactFormValues } from "@/validators/client-validator";

export async function getContacts() {
    try {
        const data = await db.query.contacts.findMany({
            orderBy: [desc(contacts.id)],
            with: {
                client: true
            }
        });
        return data;
    }
    catch (error) {
        console.error("Error al obtener los contactos:", error);
        throw error;
    }
};

export async function createContact(contact: ContactFormValues, pathToRevalidate: string | undefined) {
    let success = false;
    try {
        const parsed = await contactFormSchema.parseAsync(contact);
        if (!parsed) {
            throw new Error("Error de validación del formulario de contacto.");
        }
        const newContact: ContactInsert = {
            name: parsed.name,
            email: parsed.email,
            phone: parsed.phone ?? null,
            status: parsed.status,
            type: parsed.type,
            clientId: parsed.clientId ?? null,
        };
        await db.transaction(async (tx) => {
            await setUserId(tx)

            await tx.insert(contacts).values(newContact);
            success = true;
        });
    } catch (error) {
        console.error("Error al crear un nuevo contacto:", error);
        throw error;
    }
    if (success && pathToRevalidate) {
        revalidatePath(`${pathToRevalidate}`, "page");
    }
}

export async function updateContact(contact: ContactFormValues, pathToRevalidate: string | undefined) {
    let success = false
    try {
        if (!contact.id) {
            throw new Error("El ID del contacto no está definido.");
        }
        const parsed = await contactFormSchema.parseAsync(contact);
        if (!parsed) {
            throw new Error("Error de validación del formulario de contacto.");
        }

        await db.transaction(async (tx) => {
            await setUserId(tx)

            await tx
                .update(contacts)
                .set({
                    name: parsed.name,
                    email: parsed.email,
                    phone: parsed.phone ?? null,
                    type: parsed.type,
                    status: parsed.status,
                    clientId: parsed.clientId ?? null,
                    updatedAt: sql`NOW()`
                })
                .where(eq(contacts.id, Number(contact.id)))
            success = true;
        });
    }
    catch (error) {
        console.error("Error al modificar el contacto:", error);
        throw error;
    }
    if (success && pathToRevalidate) {
        revalidatePath(`${pathToRevalidate}`, "page");
    }
};

export async function getContact(id: number) {
    try {
        const data = await db.query.contacts.findFirst({
            where: eq(contacts.id, id),
            with: {
                client: true,
                domains: {
                    with: {
                        client: {
                            with: {
                                contacts: {
                                    where: eq(contacts.status, 'Activo')
                                }
                            }
                        },
                        provider:true,
                        contact: true
                    }
                },
            }
        });
        return data;
    }
    catch (error) {
        console.error("Error al obtener el contacto:", error);
        throw error;
    }
};

export async function getAuditContact(id: number) {
    try {
        const data = await db.query.contacts.findFirst({
            where: eq(contacts.id, id),
            with: {
                client: true,
            }
        });
        return data;
    }
    catch (error) {
        console.error("Error al obtener el contacto:", error);
        throw error;
    }
};


export async function getContactsByClientId(id: number) {
    try {
        const data = await db.query.contacts.findMany({
            where: eq(contacts.clientId, id),
            orderBy: [desc(contacts.id)],
        });
        return data;
    }
    catch (error) {
        console.error("Error al obtener los contactos del cliente:", error);
        throw error;
    }
};

export async function getActiveContactsByClientId(id: number) {
    try {
        const data = await db.query.contacts.findMany({
            where: and(eq(contacts.clientId, id), eq(contacts.status, 'Activo')),
            orderBy: [desc(contacts.id)],
        });
        return data;
    }
    catch (error) {
        console.error("Error al obtener los contactos del cliente:", error);
        throw error;
    }
};

export async function getIndividualContacts() {
    try {
        const data = await db.query.contacts.findMany({
            where: isNull(contacts.clientId),
            orderBy: [desc(contacts.id)],
        });
        return data;
    }
    catch (error) {
        console.error("Error al obtener los contactos individuales:", error);
        throw error;
    }
};

export async function getActiveIndividualContacts() {
    try {
        const data = await db.query.contacts.findMany({
            where: and(isNull(contacts.clientId), eq(contacts.status, 'Activo')),
            orderBy: [desc(contacts.id)],
        });
        return data;
    }
    catch (error) {
        console.error("Error al obtener los contactos individuales activos:", error);
        throw error;
    }
};


async function validatePhone(phone: string | undefined) {
    try {
        if (!phone) return true
        const response = await db.query.contacts.findFirst({
            where: eq(contacts.phone, phone)
        });
        return response ? false : true;
    } catch (error) {
        console.error("Error al validar el email", error)
        throw error
    }
}

async function validateEmail(email: string) {
    try {
        const response = await db.query.contacts.findFirst({
            where: eq(contacts.email, email)
        });
        return response ? false : true;
    } catch (error) {
        console.error("Error al validar el email")
        throw error
    }
}

export const validateContact = async (phone: string | undefined, email: string, oldPhone: string | undefined, oldEmail: string | undefined) => {
    try {
        const errorList: { field: "phone" | "email"; message: string }[] = [];
        const phoneIsValid = await validatePhone(phone);
        if (!phoneIsValid && phone !== oldPhone) {
            errorList.push({
                field: "phone",
                message: "El teléfono ya está registrado en el sistema.",
            });
        }
        const emailIsValid = await validateEmail(email);
        if (!emailIsValid && email !== oldEmail) {
            errorList.push({
                field: "email",
                message: "El correo ya está registrado en el sistema.",
            });
        }
        return errorList;
    } catch (error) {
        console.error("Error al validar el contacto: ", error)
        throw error;
    }
}