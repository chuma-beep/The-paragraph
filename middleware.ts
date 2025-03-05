// import { type NextRequest } from "next/server";
// import { updateSession } from "@/utils/supabase/middleware";
// import { NextResponse } from "next/server";
// import { createClient } from "./utils/supabase/client";
// import { supabase } from './services/supabaseClient';

// export async function middleware(request: NextRequest) {
//     return await updateSession(request);
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except:
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
//      * Feel free to modify this pattern to include more paths.
//      */
//     '/',
//     '/protected',
//     '/login',
//     '/profile',
//     "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
//   ],
// };





import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { NextResponse } from "next/server";
import { createClient } from "./utils/supabase/client";
import { supabase } from "./services/supabaseClient";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (session && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/protected", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/protected",
    "/login",
    "/profile",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
