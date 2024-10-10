import NextAuth, { type Session } from "next-auth"; //  { type Session }
import { authConfig } from "@/auth.config";
import { NextRequest } from "next/server";

// export default NextAuth(authConfig).auth;


/** alternative you can do authorize logic in the middleware.ts file */
type NextAuthRequest = NextRequest & { auth: Session | null };

const auth = NextAuth(authConfig).auth;

export default auth((request: NextAuthRequest) => {

  const publicRoutes = [
    "/signin",
    "/signup",
  ]
  
  const protectedRoutes = [
    "/",
    "/profile",
  ];
  
  const { auth, nextUrl } = request;
  const isLoggedIn = !!auth?.user;
  const currentPath = nextUrl.pathname;

   // Si la ruta es pública y el usuario está logeado, redirigir a la página principal
   if (publicRoutes.includes(currentPath) && isLoggedIn) {
    return Response.redirect(new URL("/", nextUrl));
  }

  // Si la ruta es protegida y el usuario NO está logeado, redirigir a "signin"
  if (protectedRoutes.includes(currentPath) && !isLoggedIn) {
    return Response.redirect(new URL("/signin", nextUrl));
  }
  
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};