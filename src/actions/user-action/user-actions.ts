"use server"
import db from "@/db";
import { auth } from "@/auth"
import { users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function getUsers() {
    try {
        const data = await db.query.users.findMany(
            {
                columns:
                {
                    id: true,
                    name: true,
                }
            }
        );
        return data;
    }
    catch (error) {
        console.error("Error al obtener usuarios:", error);
        throw error;
    }
};

export async function getUser(id: string) {
    try {
        if (!id) {
            throw new Error(`El id no está definido`);
        }
        const user = await db.query.users.findFirst({
            where: eq(users.id, id),
        });
        if (!user) {
            throw new Error(`No se encontró el usuario`);
        }
        return user;
    }
    catch (error) {
        console.error("Error al obtener el usuario:", error);
        throw error;
    }
};

export async function setUserId() {
    try {
        const session = await auth()
        
        if (!session?.user?.id) {
            throw new Error("Usuario no autenticado o ID de usuario no disponible");
        }

        const userId = session.user.id;
        
        await db.execute(sql`SELECT set_user_id(${userId})`);

    } catch (error) {
        throw error
    }
}