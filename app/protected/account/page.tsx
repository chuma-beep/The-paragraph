'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { SlLink } from "react-icons/sl";
import { FiUser } from "react-icons/fi";


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
  // const []

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
            if (profileData) {
              setAvatarUrl(profileData.avatar_url);
            }
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndProfile();
  }, []);

  if (loading) {
    return (
      <div className="p-16">
        <div className="p-8 bg-transparent shadow mt-24 animate-pulse">
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="w-48 h-48 rounded-full" />
            <Skeleton className="h-8 w-40 rounded" />
            <Skeleton className="h-6 w-24 rounded" />
            <Skeleton className="h-4 w-48 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="bg-transparent shadow rounded-md">
        <div className="flex flex-col items-center space-y-6 mt-8">
          <div className="relative">
            <div className="w-48 h-48 rounded-full overflow-hidden">
              <Image
                src={avatarUrl || '/placeholder-user.jpg'}
                alt="Profile Avatar"
                width={192}
                height={192}
                className="object-cover"
              />
            </div>
          </div>
          <h1 className="text-3xl font-medium text-gray-700">
              {profile?.full_name || 'User Name'}
          </h1>
          {/* <h2 className="text-gray-500">{profile?.username || 'No username provided'}</h2> */}
          <div className="flex items-center space-x-2">
            <SlLink className="text-gray-500" />
            <p className="text-gray-500">{profile?.website || 'No website provided'}</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 font-light">
            {profile?.bio || 'No bio available.'}
          </p>
          <Link href="/protected/account/account-settings">
            <button className="mt-6 px-6 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition">
              Edit Profile
            </button>
          </Link>
        </div>

        <div className="flex justify-center mt-8">
          <button className="px-6 py-2 text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600 transition">
            followers
          </button>
        </div>
      </div>
    </div>
  );
}
