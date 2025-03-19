import { users } from "@/db/schema";

declare module "@auth/core/adapters" {
  export interface AdapterUser {
    role: (typeof users.$inferSelect)["role"];
  }
}