import type { AdapterUser as DefaultAdapterUser } from "@auth/core/adapters";
import { users } from "@/drizzle/schema";

declare module "@auth/core/adapters" {
  export interface AdapterUser {
    role: (typeof users.$inferSelect)["role"];
  }
}