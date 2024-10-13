
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton'; // Import shadcn Skeleton

interface Profile {
  full_name: string;
  username: string;
  website: string;
  avatar_url: string;
  bio: string;
}

const supabase = createClient();

export default function Profile() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError) {
          console.error('Error fetching user:', userError.message);
          setLoading(false);
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
          } else {
            setProfile(profileData);

            if (profileData?.avatar_url) {
              // Generate the full URL for the avatar image
              const { data } = supabase.storage.from('avatars').getPublicUrl(profileData.avatar_url);
              if (data?.publicUrl) {
                setAvatarUrl(data.publicUrl); // Set the public URL for the image
              }
            }
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false); // Set loading to false when data fetching is complete
      }
    };

    fetchUserAndProfile();
  }, []);

  if (loading) {
    return (
      <div className="p-16">
        <div className="p-8 bg-transparent shadow mt-24 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0">
              <Skeleton className="h-6 w-16 mx-auto rounded" />
              <Skeleton className="h-6 w-16 mx-auto rounded" />
            </div>
            <div className="relative">
              <Skeleton className="w-48 h-48 bg-gray-400 rounded-full mx-auto" />
            </div>
            <div className="space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center">
              <Skeleton className="h-8 w-32 rounded" />
            </div>
          </div>
          <div className="mt-20 text-center border-b pb-12">
            <Skeleton className="h-8 w-40 mx-auto rounded" />
            <Skeleton className="h-4 w-24 mx-auto mt-4 rounded" />
            <Skeleton className="h-6 w-64 mx-auto mt-8 rounded" />
            <Skeleton className="h-4 w-48 mx-auto mt-2 rounded" />
          </div>
        </div>
      </div>
    );
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
            <div className="w-48 h-48 bg-transparent mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
              <Image
                src={avatarUrl || '/avatar.png'}
                alt="Profile Avatar"
                width={192}
                height={192}
                className="rounded-full h-48 w-48 object-cover"
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
  );
}
