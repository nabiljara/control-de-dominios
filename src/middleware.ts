import NextAuth, { type Session } from "next-auth";
import { authConfig } from "@/auth.config";
import { NextRequest, NextResponse } from "next/server";

type NextAuthRequest = NextRequest & { auth: Session | null };

const auth = NextAuth(authConfig).auth;

export default auth((request: NextAuthRequest) => {
  const publicRoutes = new Set(["/signin", "/signup", "/maintenance"]);
  const protectedRoutesPrefixes = ["/audits", "/domains", "/providers", "/clients", "/contacts"];
  
  const { auth, nextUrl } = request;
  const isLoggedIn = !!auth?.user;
  const currentPath = nextUrl.pathname;
  const maintenanceUrl = new URL("/maintenance", nextUrl);
  const signinUrl = new URL("/signin", nextUrl);
  const homeUrl = new URL("/", nextUrl);
  const notFoundUrl = new URL("/not-found", nextUrl);
  
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === "true";
  const isPublicRoute = publicRoutes.has(currentPath);
  const isProtectedRoute = currentPath === "/" || protectedRoutesPrefixes.some(prefix => currentPath.startsWith(prefix));

  // Redirigir a /maintenance si está en modo mantenimiento y no está ya en /maintenance
  if (isMaintenanceMode && currentPath !== "/maintenance") {
    return NextResponse.redirect(maintenanceUrl);
  }

  // Si el sitio NO está en mantenimiento y el usuario intenta acceder a /maintenance, redirigir a not-found
  if (currentPath === "/maintenance" && !isMaintenanceMode) {
    return NextResponse.rewrite(notFoundUrl);
  }

  // Si el usuario está autenticado y la ruta es pública, redirigir a la página principal
  if (isLoggedIn && isPublicRoute) {
    return NextResponse.redirect(homeUrl);
  }

  // Si la ruta es protegida y el usuario no está autenticado, redirigir a /signin
  if (!isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(signinUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};