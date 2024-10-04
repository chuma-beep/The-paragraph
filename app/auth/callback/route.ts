// import { NextResponse } from 'next/server';
// import { createClient } from '@/utils/supabase/server';

// export async function GET(request: Request) {
//   const { searchParams, origin } = new URL(request.url);
//   const code = searchParams.get('code');
//   const next = searchParams.get('next') ?? '/protected';

//   const supabase = createClient();
//   const { data: { session } } = await supabase.auth.getSession();


//   // If the user is authenticated, redirect to the /protected route
//   if (session) {
//     return NextResponse.redirect(`${origin}/protected`);
//   }

//   // Handle the OAuth callback by exchanging the code for a session
//   if (code) {
//     const { error } = await supabase.auth.exchangeCodeForSession(code);
//     if (!error) {
//       const forwardedHost = request.headers.get('x-forwarded-host');
//       const isLocalEnv = process.env.NODE_ENV === 'development';

//       if (isLocalEnv) {
//         return NextResponse.redirect(`${origin}/protected`);
//       } else if (forwardedHost) {
//         return NextResponse.redirect(`https://${forwardedHost}${next}`);
//       } else {
//         return NextResponse.redirect(`${origin}${next}`);
//       }
//     }
//   }

//   // If the code is missing or there was an error, redirect to an error page
//   return NextResponse.redirect(`${origin}/auth/auth-code-error`);
// }




import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/protected';

  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  // Retrieve the base URL from environment variables
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // If the user is authenticated, redirect to the /protected route
  if (session) {
    return NextResponse.redirect(`${baseUrl}/protected`);
  }

  // Handle the OAuth callback by exchanging the code for a session
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Use the base URL and 'next' parameter for redirection
      return NextResponse.redirect(`${baseUrl}${next}`);
    }
  }

  // If the code is missing or there was an error, redirect to an error page
  return NextResponse.redirect(`${baseUrl}/auth/auth-code-error`);
}
