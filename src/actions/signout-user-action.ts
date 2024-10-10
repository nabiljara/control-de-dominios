"use server"

import { signOut } from "@/auth";

export async function signoutUserAction(){
  try {
    await signOut({redirect:false})
  } catch (error) {
    console.log(error);
  }
}