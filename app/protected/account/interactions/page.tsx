"use client"



import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { CiHeart } from "react-icons/ci";
import { LuMessageCircle } from "react-icons/lu";
import Link from "next/link";
import { User } from "@supabase/auth-js/dist/module/lib/types";

interface Post {
  comments: number | string;
  likes: number | string;
  id: number | string;
  title: string;
  date: string;
  tags: string[];
  content: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  cover_image_url?: string | null;
}

const PostSkeleton = () => (
  <Card>
    <div className="w-full h-[225px] bg-gray-200 animate-pulse rounded-t-lg"></div>
    <CardContent className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
      </div>
    </CardContent>
  </Card>
);

const supabase = createClient();

export default function Interactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error('Error fetching user:', userError.message);
          setLoading(false);
          return;
        }
  
        if (userData?.user) {
          setUser(userData.user);
          
          const { data: postData, error: postError } = await supabase
            .from('posts')
            .select(`*, likes (id), comments (id)`) 
            .eq('profile_id', userData.user.id);
  
          if (postError) {
            console.error('Error fetching posts:', postError.message);
          } else {
            const postsWithCounts = postData.map((post) => ({
              ...post,
              likes_count: post.likes ? post.likes.length : 0,
              comments_count: post.comments ? post.comments.length : 0,
            }));
            setPosts(postsWithCounts);
          }
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 p-6">
        <div className="flex items-center mb-4">
          <Input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 mr-4"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => <PostSkeleton key={index} />)
            : posts.map((post) => (
                <Link key={post.id} href={`/post/${post.id}`}>
                  <Card className="transition-transform transform hover:scale-105 hover:shadow-lg"                  >
                    <img
                      src={post.cover_image_url || "/placeholder.svg"}
                      alt={post.title}
                      width={400}
                      height={225}
                      className="rounded-t-lg object-cover w-full aspect-[16/9]"
                    />
                    <CardContent className="p-4">
                      <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                      <div className="flex items-center mb-2">
                        <CiHeart className="w-4 h-4 mr-1" />
                        <span className="text-muted-foreground">{post.likes_count}</span>
                      </div>
                      <div className="flex items-center">
                        <LuMessageCircle />
                        <span className="text-muted-foreground">{post.comments_count}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
        </div>
      </main>
    </div>
  );
}
