
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import Image from 'next/image'

interface Profile {
  full_name: string;
  username: string;
  website: string;
  avatar_url: string;
  bio: string;
}

const supabase = createClient()

export default function Profile() {
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError) {
          console.error('Error fetching user:', userError.message);
          setLoading(false); // Stop loading when error occurs
          return;
        }

        if (userData?.user) {
          setUser(userData.user);

          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, username, website, avatar_url, bio')
            .eq('id', userData.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching user profile:', profileError.message);
          } else if (profileData?.avatar_url) {
            // Generate the full URL for the avatar image
            const { data } = supabase.storage.from('avatars').getPublicUrl(profileData.avatar_url);
            if (data?.publicUrl) {
              setAvatarUrl(data.publicUrl); // Set the public URL for the image
            }
          }

          setProfile(profileData);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false); // Set loading to false when data fetching is complete
      }
    };

    fetchUser();
  }, []);


  
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


  const Skeleton = () => (

    <div className="animate-pulse p-16">
      <div className="p-8 bg-slate-400 shadow mt-24">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0">
            <div className="h-6 bg-gray-400 rounded w-16 mx-auto"></div>
            <div className="h-6 bg-gray-400 rounded w-16 mx-auto"></div>
          </div>
          <div className="relative">
            <div className="w-48 h-48 bg-gray-400 rounded-full mx-auto"></div>
          </div>
          <div className="space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center">
            <div className="h-8 bg-gray-400 rounded w-32"></div>
          </div>
        </div>
        <div className="mt-20 text-center border-b pb-12">
          <div className="h-8 bg-gray-400 rounded w-40 mx-auto"></div>
          <div className="h-4 bg-gray-400 rounded w-24 mx-auto mt-4"></div>
          <div className="h-6 bg-gray-400 rounded w-64 mx-auto mt-8"></div>
          <div className="h-4 bg-gray-400 rounded w-48 mx-auto mt-2"></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <Skeleton />;
  }

  return (
    <div className="p-16">
      <div className="p-8 bg-transparent shadow mt-24">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0">
            <div>
              <p className="font-bold text-gray-700 text-xl">22</p>
              <p className="text-gray-400">Friends</p>
            </div>
            <div>
              <p className="font-bold text-gray-500 text-xl">89</p>
              <p className="text-gray-400">Comments</p>
            </div>
          </div>
          <div className="relative">
            <div className="w-48 h-48 bg-tranparent mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
              <Image
                src={avatar_url || '/avatar.png'}
                alt="Profile Avatar"
                width={192}
                height={192}
                className="rounded-full h-48 w-48"
              />
            </div>
          </div>
          <div className="space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center">
            <button className="text-gray-300 py-2 px-4 uppercase rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">
              Contact
            </button>
          </div>
        </div>
        <div className="mt-20 text-center border-b pb-12">
          <h1 className="text-4xl font-medium text-gray-700">
            {profile?.full_name || 'User Name'}
          </h1>
          <p className="mt-8 text-gray-500">Username: {profile?.username || 'No username provided'}</p>
          <p className="mt-8 text-gray-500">{profile?.website || 'No website provided'}</p>
        </div>
        <div className="mt-12 flex flex-col justify-center">
          <p className="text-gray-600 text-center font-light lg:px-16">
            {profile?.bio || 'No bio available.'}
          </p>
          <Link href="/protected/account/account-settings" className="justify-center align-middle w-full flex">
            <button className="text-indigo-500 py-2 px-4 font-medium mt-4">
              Edit Profile
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
