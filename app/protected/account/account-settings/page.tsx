

'use client'  // Make sure this is a client component
import AccountForm from './account-form'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import Avatar from './avatar'

export default function Account() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);  // Type user properly

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);  // Added `supabase` to the dependency array
 
    

  // Ensure you don't render `AccountForm` until `user` is defined
  if (!user) {
    return <div>Loading...</div>;
  }

  return <AccountForm user={user} href='/protected/account' />

}
