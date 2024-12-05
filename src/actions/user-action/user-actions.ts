"use server"
import db from "@/db";
import { users } from "@/db/schema";
import { desc , eq, or} from "drizzle-orm";

export async function getUsers() {
    try{
        const data = await db.query.users.findMany({columns:{id:true,name:true}});
        return data;
    }
    catch(error){
        console.error("Error al obtener usuarios:", error);
        throw error;
    }
};