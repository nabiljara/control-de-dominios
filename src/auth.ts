import NextAuth from "next-auth"
import Credencials from "next-auth/providers/credentials"
import * as v from "valibot"
import { SigninSchema } from "@/validators/signin-validator"
import { findUserByEmail } from "@/resources/user-queries"
import argon2 from "argon2"
import { authConfig } from "@/auth.config"
import { OAuthAccountAlreadyLinkedError } from "@/lib/custom-errors"

const {providers: authConfigProviders, ...authConfigRest} = authConfig
const nextAuth = NextAuth({
  ...authConfigRest,
  providers: [
    ...authConfigProviders,
    Credencials({
      async authorize(credentials) {
        const parsedCredentials = v.safeParse(SigninSchema, credentials)

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.output

          const user = await findUserByEmail(email)
          if (!user) return null;
          //Custom error
          if (!user.password) throw new OAuthAccountAlreadyLinkedError();

          const passwordsMatch = await argon2.verify(user.password, password)

          if (passwordsMatch) {
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
          }
        }
        return null;
      }
    }),
    

  ]
})

export const { signIn, auth, signOut, handlers } = nextAuth;