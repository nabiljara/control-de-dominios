"use server"

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

type Res =
  | { success: true }
  | { success: false; error: string; statusCode: 500 | 401 }

export async function signinUserAction(params: unknown): Promise<Res> {

  try {

    if (typeof params !== "object" || params === null || Array.isArray(params)) {
      throw new Error("Objeto JSON inválido.")
    }
    await signIn("credentials", { ...params, redirect: false })

    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
        case "CallbackRouteError":
          return { success: false, error: "Credenciales inválidas.", statusCode: 401 };
        case "OAuthAccountAlreadyLinked" as AuthError["type"]:
          return { success: false, error: "Ingrese con su cuenta de Google", statusCode: 401 }
        default:
          return { success: false, error: "Opss. Algo salió mal. ", statusCode: 500 }
      }
    }
    return { success: false, error: "Internal server error.", statusCode: 500 }
  }


}