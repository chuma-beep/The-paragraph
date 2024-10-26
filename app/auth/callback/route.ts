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
//         // return NextResponse.redirect(`${origin}${next}`);
//         return NextResponse.redirect(`${origin}/protected`);
//       }
//     }
//   }

//   // If the code is missing or there was an error, redirect to an error page
//   return NextResponse.redirect(`${origin}/auth/auth-code-error`);
// }



import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const nextPath = searchParams.get('next') || '/protected';

  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  // If the user is already authenticated, redirect to the /protected route
  if (session) {
    return NextResponse.redirect(`${origin}/protected`);
  }

  // Handle the OAuth callback by exchanging the code for a session
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      const isLocalEnv = process.env.NODE_ENV === 'development';
      const targetURL = isLocalEnv
        ? `${origin}/protected`
        : `https://${request.headers.get('x-forwarded-host') || origin.replace(/^https?:\/\//, '')}${nextPath}`;

      return NextResponse.redirect(targetURL);
    }
  }

  // Redirect to an error page if code is missing or there's an error
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
