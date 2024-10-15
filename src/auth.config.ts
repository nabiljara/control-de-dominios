import type { NextAuthConfig } from "next-auth";
import * as schema from "@/db/schema"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import db from "@/db"
import { oauthVerifyEmailAction } from "@/actions/oauth-verify-email-action";
import Google from "next-auth/providers/google"


export const authConfig = {
  adapter: DrizzleAdapter(db, {
    accountsTable: schema.accounts,
    usersTable: schema.users,
    authenticatorsTable: schema.authenticators,
    sessionsTable: schema.sessions,
    verificationTokensTable: schema.verificationTokens
  }),
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  pages: { signIn: "/signin" },
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      if (user?.role) token.role = user.role
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    }
  },
  events: {
    async linkAccount({ user, account }) {
      if (["google"].includes(account.provider)) {
        if (user.email) await oauthVerifyEmailAction(user.email)
      }
    }
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ]

} satisfies NextAuthConfig