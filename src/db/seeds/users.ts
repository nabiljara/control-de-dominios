import { DB } from "@/db";
import { userRoleEnum, users } from "@/db/schema";
import argon2 from "argon2";

const mock = async () => {
  const password = process.env.SEED_USER_PASSWORD || "admin";
  return [
    {
      name: "Sistema",
      email: "desarrollo@kerneltech.dev",
      password: await argon2.hash(password),
      role: "user" as typeof userRoleEnum.enumValues[number],
    }
  ];
};

export async function seed(db: DB) {
  const insertData = await mock();
  await db.insert(users).values(insertData);
}