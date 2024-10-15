import Image from 'next/image';
import { createClient} from '@/utils/supabase/server'
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default function GithubAuth() {
  const signIn = async () => {
    'use server';

    const supabase = createClient();
    const origin = headers().get('origin');
    const { error, data } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      console.log(error);
    } else {
      return redirect(data.url);
    }
  };


  return (
    <form
      action={signIn}
      className="flex items-center"
    >
      <button className="hover:bg-gray-300 bg-gray-400 p-7 rounded-xl">
        <Image
          className="mx-auto mb-3"
          src="/code.png"
          width={40}
          height={40}
          alt="GitHub logo"
        />
           GitHub
      </button>
    </form>
  );
}