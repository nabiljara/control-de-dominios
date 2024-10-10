"use server"

import * as v from "valibot";
import { SignupSchema } from "@/validators/signup-validator";
import argon2 from "argon2";
import db from "@/drizzle";
import { eq } from "drizzle-orm";
import { lower, users } from "@/drizzle/schema";
type Res =
  | { success: true }
  | { success: false, error: v.FlatErrors<undefined>, statusCode: 400 }
  | { success: false, error: string, statusCode: 500 | 409 }


export async function signupUserAction(params: unknown): Promise<Res> {

  const parsedValues = v.safeParse(SignupSchema, params);

  if (!parsedValues.success) {
    const flatErrors = v.flatten(parsedValues.issues);
    return { success: false, error: flatErrors, statusCode: 400 }
  }

  const { name, email, password } = parsedValues.output;

  try {
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(lower(users.email), email.toLowerCase()))
      .limit(1)
      .then((res) => {
        return res[0] ?? null
      })

    if (existingUser?.id) {
      return { success: false, error: "Email already exists.", statusCode: 409 }
    }

  } catch (error) {
    console.log(error)
    return { success: false, error: "Internal server error.", statusCode: 500 }
  }

  try {
    const hashedPassword = await argon2.hash(password);

    const newUser = await db.insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
      })
      .returning({ id: users.id })
      .then((res) => {
        return res[0] ?? null
      })

    console.log({ insertedId: newUser.id });


    return { success: true }

  } catch (error) {
    console.log(error)
    return { success: false, error: "Internal server error.", statusCode: 500 }
  }
}