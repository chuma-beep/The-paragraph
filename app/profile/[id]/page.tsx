'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Heart, MessageCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import BackButton from '@/components/BackButton';
import { isString } from 'lodash';

interface Profile {
  username: string;
  avatar_url: string;
  bio: string;
  full_name: string;
  website: string;
}

interface Post {
  id: number | string;
  title: string;
  content: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

const supabase = createClient();

async function fetchProfile(profileId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('username, avatar_url, bio, full_name, website')
    .eq('id', profileId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  return data;
}

async function fetchPosts(profileId: string): Promise<Post[]> {
  const { data: postData, error } = await supabase
    .from('posts')
    .select('id, title, content, created_at, likes (id), comments (id)')
    .eq('profile_id', profileId);

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return postData.map((post) => ({
    ...post,
    likes_count: post.likes ? post.likes.length : 0,
    comments_count: post.comments ? post.comments.length : 0,
  }));
}

function ProfileHeaderSkeleton() {
  return (
    <div className="p-8 shadow mt-24">
      <div className="flex flex-col items-center text-center gap-6">
        <Skeleton circle width={192} height={192} />
        <Skeleton width={200} height={30} />
        <Skeleton width={150} />
        <Skeleton width={250} />
        <Skeleton width={300} height={20} />
        <Skeleton width={100} height={40} />
      </div>
    </div>
  );
}

function ProfileHeader({ profile }: { profile: Profile }) {
  return (
    <div className="p-8 shadow mt-24">
      <div className="flex flex-col items-center text-center gap-6">
        <div className="relative">
          <div className="bg-gray-200 rounded-full shadow-xl">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={`${profile.full_name}'s avatar`}
                width={192}
                height={200}
                className="rounded-full h-48 w-48"
              />
            ) : (
              <div className="w-48 h-48 rounded-full bg-gray-300"></div>
            )}
          </div>
        </div>
        <h1 className="text-3xl font-medium">{profile.full_name || 'User Name'}</h1>
        <p className="text-gray-500">Username: {profile.username || 'No username provided'}</p>
        <p className="text-gray-500">{profile.website || 'No website provided'}</p>
        <p className="text-gray-600 font-semibold">{profile.bio || 'No bio available.'}</p>
        <span className='flex flex-row gap-2'>
       {/* <button className="text-white py-2 px-6 rounded bg-blue-500 hover:bg-blue-600 transition">
          Follow
        </button>
        <button className="text-white py-2 px-6 rounded bg-blue-500 hover:bg-blue-600 transition">
          Followers <span>0</span> 
        </button> */}
        </span>
      </div>
    </div>
  );
}

function PostListSkeleton() {
  return (
    <div className="container mx-auto py-8">
      <h2 className="text-center text-3xl font-bold mb-8">
        <Skeleton width={250} />
      </h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle><Skeleton width={200} /></CardTitle>
              <CardDescription className="flex items-center text-sm text-muted-foreground">
                <Skeleton width={220} />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton count={3} />
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Skeleton width={40} height={20} circle />
                <Skeleton width={40} />
                <Skeleton width={40} height={20} circle />
                <Skeleton width={40} />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PostList({ posts }: { posts: Post[] }) {
  return (
    <div className="container mx-auto py-8">
      <h2 className="text-center text-3xl font-bold mb-8">Posts</h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} href={`/post/${post.id}`} className="transition-transform hover:scale-105">
            <Card>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  {new Date(post.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReactMarkdown>
                  {post.content.length > 100 ? post.content.substring(0, 100) + "..." : post.content}
                </ReactMarkdown>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-gray-500" />
                  <span>{post.likes_count}</span>
                  <MessageCircle className="h-4 w-4 ml-3 text-gray-500" />
                  <span>{post.comments_count}</span>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function UserProfile() {
  const { id } = useParams();
  const idString = Array.isArray(id) ? id[0]: id;
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (id) {
      (async () => {
        setLoading(true);
        const profileData = await fetchProfile(idString);
        const postsData = await fetchPosts(idString);

        setProfile(profileData);
        setPosts(postsData);
        setLoading(false);
      })();
    }
  }, [id]);

  if (loading) {
    return (
      <div>
        <BackButton />
        <ProfileHeaderSkeleton />
        <PostListSkeleton />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-16">
        <BackButton />
        <p>Profile not found.</p>
      </div>
    );
  }

  return (
    <div>
      <BackButton />
      <ProfileHeader profile={profile} />
      <PostList posts={posts} />
    </div>
  );
}
