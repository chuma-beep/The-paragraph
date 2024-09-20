

"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon } from "lucide-react"
import Image from 'next/image';
import BackButton from '@/components/BackButton';
import DOMPurify from "dompurify";
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { Heart, MessageCircle } from "lucide-react";





// Updated interface to include tags instead of category
interface Post {
  id: number | string;
  title: string;
  date: string;
  tags: string[];
  content: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
}





const UserProfile = (post: Post, index: number) => {
  const supabase = createClient();
  const { id } = useParams(); // This is the profile ID
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);


  useEffect(() => {
    if (id) {
      const fetchProfile = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles') // Use the correct table
          .select(`username, avatar_url, bio, full_name, website`) // Adjust columns as necessary
          .eq('id', id) // Match by profile ID
          .single(); // Expect a single row

        if (error) {
          console.error('Error fetching profile:', error);
          setLoading(false); // Set loading to false on error
          return;
        } 
        setProfile(data);

            
      const fetchPosts = async (profileId: string) => {
         const { data: postData, error: postError } = await supabase
            .from('posts')
            .select(`*, 
              likes (id),
              comments (id)
              `)      
            .eq('profile_id', profileId)
            .range(0, 5)  

          if (postError){
            console.error('Error fetching posts:', postError);
            return;
          }


          const postsWithCounts = postData.map((post) => ({
            ...post,
            likes_count: post.likes ? post.likes.length : 0,
            comments_count: post.comments ? post.comments.length : 0,
          }));
        
           


           setPosts(postsWithCounts || []);

      };

     

      fetchPosts(id);
      setLoading(false);

      };

      fetchProfile();
    }
  }, [id, supabase]);


  const Skeleton = () => (
    <div className="animate-pulse p-16">
      <div className="p-8 bg-white shadow mt-24">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0">
            <div className="h-6 bg-gray-200 rounded w-16 mx-auto"></div>
            <div className="h-6 bg-gray-200 rounded w-16 mx-auto"></div>
          </div>
          <div className="relative">
            <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto"></div>
          </div>
          <div className="space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center">
            <div className="h-8 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
        <div className="mt-20 text-center border-b pb-12">
          <div className="h-8 bg-gray-200 rounded w-40 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-24 mx-auto mt-4"></div>
          <div className="h-6 bg-gray-200 rounded w-64 mx-auto mt-8"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mx-auto mt-2"></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <Skeleton />;
  }

  if (!profile) {
    return( 
    <>
   <div className="container mx-auto py-8">   
    <BackButton/>
    <p>Profile Not Found</p>
    </div>
    </>
    );
  }

  return (
    <div className="p-16">
          <BackButton/>
      <div className="p-8 bg-white shadow mt-24">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0">
            {/* <div>
              <p className="font-bold text-gray-700 text-xl">22</p>
              <p className="text-gray-400">Friends</p>
            </div>
            <div>
              <p className="font-bold text-gray-700 text-xl">89</p>
              <p className="text-gray-400">Comments</p>
            </div> */}
          </div>
          <div className="relative">
            <div className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={`${profile.full_name}'s avatar`}
                  width={192}
                  height={192}
                  className="rounded-full h-48 w-48"
                />
              ) : (
                <div className="w-48 h-48 bg-gray-200 rounded-full"></div>
              )}
            </div>
          </div>
          <div className="space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center">
            <button className="text-white py-2 px-4 uppercase rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">
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
          {/* Additional Section */}
          <div className="max-w-4xl w-full mt-10">
            <div className="bg-white shadow-md rounded-lg p-6">
    <div className="container mx-auto py-8">
      <div className='w-full justify-center text-center'>

      <h2 className="text-3xl font-bold mb-8">Paragraphs</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link key={post.id} href={`/post/${post.id}`}
          className='transition-transform duration-300 ease-in-out transform hover:scale-105 cursor-pointer"'
          >
          <Card  className="flex flex-col">
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  {new Date(post.created_at).toLocaleDateString()}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
            <ReactMarkdown>
          {post.content.length > 100 ? post.content.substring(0, 50) + "..." : post.content}
        </ReactMarkdown>
            </CardContent>
            <CardFooter>
<div className="flex items-center space-x-2 text-sm text-muted-foreground">
    <Heart className="mr-1 h-3 w-3" />
    <span>{post.likes_count || 0}</span>
    <MessageCircle className="ml-2 mr-1 h-3 w-3" />
    <span>{post.comments_count || 0}</span>
  </div>

              {/* <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div> */}
            </CardFooter>
          </Card>
          </Link>
        ))}
      </div>
    </div>
                   
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



export default UserProfile;