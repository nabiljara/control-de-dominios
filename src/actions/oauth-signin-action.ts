"use server"
import { signIn } from "@/auth"
import { isRedirectError } from "next/dist/client/components/redirect"

export async function oauthSigninAction(provider: "google") {
  try {
    await signIn(provider, { redirectTo: "/" })
  } catch (error) {
    if (isRedirectError(error )){
      throw error;
    }

    console.log(error)
  }
}