import NextAuth, { type Session } from "next-auth";
import { authConfig } from "@/auth.config";
import { NextRequest, NextResponse } from "next/server";

type NextAuthRequest = NextRequest & { auth: Session | null };

const auth = NextAuth(authConfig).auth;

export default auth((request: NextAuthRequest) => {
  const publicRoutes = ["/signin", "/signup", "/maintenance"];
  const protectedRoutesPrefixes = ["/profile", "/domains", "/providers", "/clients"];
  
  const { auth, nextUrl } = request;
  const isLoggedIn = !!auth?.user;
  const currentPath = nextUrl.pathname;

  // Verificar si el sitio está en modo mantenimiento
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';

  // Si está en modo mantenimiento y no es la página de mantenimiento, redirigir a mantenimiento
  if (isMaintenanceMode && currentPath !== '/maintenance') {
    return NextResponse.redirect(new URL("/maintenance", nextUrl));
  }

  // Si la ruta es pública y el usuario está logeado, redirigir a la página principal
  if (publicRoutes.includes(currentPath) && isLoggedIn && !isMaintenanceMode) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Verificar si la ruta es protegida por prefijo o si es la raíz ("/")
  const isProtectedRoute = currentPath === "/" || protectedRoutesPrefixes.some(prefix => currentPath.startsWith(prefix));

  // Si la ruta es protegida y el usuario NO está logeado, redirigir a "signin"
  if (isProtectedRoute && !isLoggedIn && !isMaintenanceMode) {
    if (currentPath !== "/signin") {
      return NextResponse.redirect(new URL("/signin", nextUrl));
    }
  }

  // Si está autenticado y la ruta es protegida, permitir acceso
  if (isLoggedIn || !isProtectedRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};