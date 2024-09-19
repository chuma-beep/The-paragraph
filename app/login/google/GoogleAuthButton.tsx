import Image from "next/image";
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default function GoogleAuthButton() {
  const signIn = async () => {
    'use server';

    const supabase = createClient();
    const origin = headers().get('origin');
    const { error, data } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      console.log(error);
      return;
    } 

    return redirect(data.url);
  };

  return (
    <form
      action={signIn}
      className="flex items-center"
    >
      <button className="hover:bg-gray-200 p-8 rounded-xl" 
      type="submit"
      >
        <Image
          className="mx-auto mb-3"
          src="/google.png"
          height={30}
          width={30}
          alt="Google Icon"
        />
        <span className="mt-3"
        >Google</span>
      </button>
    </form>
  );
};
