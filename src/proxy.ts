import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/features/admin/session-cookie";

/**
 * Checagem rápida do backoffice: sem o cookie de sessão, vai para o login.
 * Quem valida o token de verdade é a API (token vencido também volta ao login).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/entrar") return NextResponse.next();
  if (!request.cookies.has(SESSION_COOKIE))
    return NextResponse.redirect(new URL("/admin/entrar", request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
