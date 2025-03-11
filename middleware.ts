import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { NextResponse } from "next/server";
import { createClient } from "./utils/supabase/client";
import { supabase } from "./services/supabaseClient";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response})

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    //protected route check

  const protectedRoutes = ['/dashboard', '/profile', '/settings']
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute && !session ){
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return response
}

//   if (session && request.nextUrl.pathname === "/") {
//     return NextResponse.redirect(new URL("/protected", request.url));
//   }
//   return NextResponse.next();
// }

export const config = {
  matcher: [
    "/",
    "/protected",
    "/login",
    "/profile",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
