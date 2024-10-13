'use client'; // Marks this as a client-side component

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { type User } from '@supabase/supabase-js';
import Avatar from './avatar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AccountForm({ user, href }: { user: User | null; href: string }) {
  const supabase = createClient(); // Ensure client-side instance is used
  const [loading, setLoading] = useState<boolean>(true);
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);

  // Fetch profile data
  const getProfile = useCallback(async () => {
    if (!user?.id) return; // Ensure user exists

    try {
      setLoading(true);
      const { data, error, status } = await supabase
        .from('profiles')
        .select('full_name, username, website, avatar_url, bio')
        .eq('id', user?.id)
        .single();

      if (error && status !== 406) {
        console.error('Error fetching profile:', error);
        toast.error('Error loading user data: ' + error.message);
        return;
      }

      if (data) {
        setFullname(data.full_name);
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
        setBio(data.bio);
      }
    } catch (error) {
      toast.error('Error loading user data!');
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  // Update profile function
  async function updateProfile({
    username,
    fullname,
    website,
    avatar_url,
    bio,
  }: {
    username: string | null;
    fullname: string | null;
    website: string | null;
    avatar_url: string | null;
    bio: string | null;
  }) {
    if (!user?.id) {
      toast.error('User not found');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.from('profiles').upsert({
        id: user?.id,
        full_name: fullname,
        username,
        website,
        avatar_url,
        bio,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast.success('Profile updated!');
    } catch (error) {
      toast.error('Error updating the data!');
    } finally {
      setLoading(false);
    }
  }

  // Handle avatar upload
  const handleAvatarUpload = (newAvatarUrl: string) => {
    setAvatarUrl(newAvatarUrl);
    updateProfile({ username, fullname, website, avatar_url: newAvatarUrl, bio });
  };

  return (
    <div className="relative flex flex-col w-full min-w-0 mb-6 break-words border rounded-2xl bg-light/30">
      <div className="px-9 pt-9 flex-auto min-h-[70px] pb-0 bg-transparent">
        {loading ? (
          // Enhanced Skeleton loader
          <div className="flex flex-col space-y-4 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 bg-gray-200 rounded-full"></div> {/* Avatar Skeleton */}
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 rounded-md w-3/4"></div> {/* Username Skeleton */}
                <div className="h-4 bg-gray-200 rounded-md w-1/2"></div> {/* Secondary info Skeleton */}
              </div>
            </div>
            <div className="h-0.5 bg-gray-200"></div> {/* Divider Skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded-md w-4/6"></div>
              <div className="h-4 bg-gray-200 rounded-md w-3/6"></div>
            </div>
            <div className="h-0.5 bg-gray-200"></div> {/* Divider Skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded-md w-full"></div>
              <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded-md w-2/3"></div>
            </div>
          </div>
        ) : (

            <>
            <div className="flex flex-wrap mb-6 xl:flex-nowrap">
              <div className="grow">
                <div className="flex flex-wrap items-start justify-between mb-2">
                  <div className="flex flex-col">
                    
                  <div className="relative mb-6">
                       <label htmlFor="avatar" className="block mb-2 text-sm font-medium text-gray-700">
                                                  Avatar
                        </label>
                        <Avatar
                           uid={user?.id || 'default-id'}
                          url={avatar_url}                      
                           size={100}
                          onUpload={handleAvatarUpload}
                        />
                       </div>
                    <div className="flex items-center mb-2">
                      <a className="text-secondary-inverse hover:text-primary transition-colors duration-200 ease-in-out font-semibold text-[1.5rem] mr-1">
                        {username || 'Username'}
                      </a>
                    </div>
                  </div>
                </div>
                <hr className="w-full h-px border-neutral-200" />
                <div id="assignments" className="pt-6">
                  <div className="text-base font-semibold">Assignments</div>
                  <div className="mt-4">
                  <form>
                  <div className="relative mb-6">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      id="email"
                      type="text"
                      value={user?.email || ''}
                      disabled
                      className="block w-full p-2.5 text-sm border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="relative mb-6">
                    <label htmlFor="fullName" className="block mb-2 text-sm font-medium ">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={fullname || ''}
                      onChange={(e) => setFullname(e.target.value)}
                      className="block w-full p-2.5 text-sm  border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="relative mb-6">
                    <label htmlFor="username" className="block mb-2 text-sm font-medium">
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={username || ''}
                      onChange={(e) => setUsername(e.target.value)}
                      className="block w-full p-2.5 text-sm border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="relative mb-6">
                    <label htmlFor="website" className="block mb-2 text-sm font-medium ">
                      Website
                    </label>
                    <input
                      id="website"
                      type="url"
                      value={website || ''}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="block w-full p-2.5 text-sm  border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="relative mb-6">
                    <label htmlFor="bio" className="block mb-2 text-sm font-medium ">
                       Bio
                    </label>
                    <input
                      id="bio"
                      type="text"
                      value={bio || ''}
                      onChange={(e) => setBio(e.target.value)}
                      className="block w-full p-2.5 text-sm  border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="mb-6">
                    <button
                      type="button"
                      onClick={() => updateProfile({ username, bio, fullname, website, avatar_url })}
                      className="inline-block px-6 py-3 text-base font-medium leading-normal align-middle transition-colors duration-150 ease-in-out border-0 shadow-none cursor-pointer rounded-2xl bg-tranparent hover:bg-slate-500"
                      disabled={loading}
                    >
                      {loading ? 'Loading ...' : 'Update'}
                    </button>
                  </div>
                  <div className="mb-6">
                    {/* <button
                      type="button"
                      onClick={handleClick}
                      className="inline-block px-6 py-3 text-base font-medium leading-normal text-center text-blue-300 align-middle transition-colors duration-150 ease-in-out border-0 shadow-none cursor-pointer rounded-2xl bg-secondary hover:bg-secondary-dark active:bg-secondary-dark focus:bg-secondary-dark"
                    >
                      Go to Profile {href}
                    </button> */}
                  </div>
                </form>
                  </div>
                </div>
              </div>
            </div>
          </>

        )}
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} draggable />
    </div>
  )
}

