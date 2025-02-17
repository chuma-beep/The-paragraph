// import { type NextRequest } from "next/server";
// import { updateSession } from "@/utils/supabase/middleware";
// import { NextResponse } from "next/server";
// import { createClient } from "./utils/supabase/client";
// import { supabase } from './services/supabaseClient';

// export async function middleware(request: NextRequest) {
//   return await updateSession(request);
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



// middleware.ts
import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);

  // Refresh session and get current session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/signup', '/forgot-password'];
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);

  // If there's no session and the route isn't public, redirect to login
  if (!session && !isPublicRoute) {
    const redirectUrl = new URL('/login', request.url);
    // Store the attempted URL to redirect back after login
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If there's a session and user tries to access login/signup pages, 
  // redirect to protected area
  if (session && isPublicRoute) {
    // Check if there's a redirectTo parameter
    const redirectTo = request.nextUrl.searchParams.get('redirectTo');
    if (redirectTo) {
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
    // Default redirect to protected page
    return NextResponse.redirect(new URL('/protected', request.url));
  }

  return response;
}
