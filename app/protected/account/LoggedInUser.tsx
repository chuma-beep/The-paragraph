

'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import { User } from '@supabase/supabase-js';

const supabase = createClient();

export default function LoggedInUser() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const { data: userData, error: userError } = await supabase.auth.getUser();

  //     if (userError) {
  //       console.error('Error fetching user:', userError.message);
  //       return;
  //     }

  //     if (userData?.user) {
  //       setUser(userData.user);

  //       const { data: profileData, error: profileError } = await supabase
  //         .from('profiles')
  //         .select('avatar_url')
  //         .eq('id', userData.user.id)
  //         .single();

  //       if (profileError) {
  //         console.error('Error fetching user profile:', profileError.message);
  //       } else if (profileData?.avatar_url) {
  //         // Generate the full URL for the avatar image
  //         const { data } = supabase.storage.from('avatars').getPublicUrl(profileData.avatar_url);
  //         if (data?.publicUrl) {
  //           setAvatarUrl(data.publicUrl); // Set the public URL for the image
  //         }
  //       }
  //     }
  //   };

  //   fetchUser();
  // }, []);


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
