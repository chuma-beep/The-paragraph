

'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import { User } from '@supabase/supabase-js';

const supabase = createClient();

export default function LoggedInUser() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);


  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      setUser(user);
      
      if (user) {
        const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();
        
        if (data) {
          setAvatarUrl(data.avatar_url);
        } else {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUser();
  }, []);


  return (
    <div className="flex items-center">
          <div className="flex items-center cursor-pointer">
            <Image
              src={avatarUrl || '/avatar.png'} 
              alt="Avatar"
              width={24}
              height={24}
              className="rounded-full"
            />
          </div>
    </div>
  );
}
