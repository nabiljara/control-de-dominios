"use server"
import db, { sql } from "@/db";
import { auth } from "@/auth"
import { users } from "@/db/schema";
import { desc, eq, or } from "drizzle-orm";

export async function getUsers() {
    try {
        const data = await db.query.users.findMany({ columns: { id: true, name: true } });
        return data;
    }
    catch (error) {
        console.error("Error al obtener usuarios:", error);
        throw error;
    }
};

export async function setUserId() {
    try {
        const session = await auth()
        if (!session || !session.user) {
            throw new Error("Usuario no autenticado");
        }
        const userId = session.user.id;
        const result = await sql.transaction([
            sql`
                SELECT set_user_id(${userId})
              `,
        ]);
        return result[0]
    } catch (error) {
        throw error
    }
}