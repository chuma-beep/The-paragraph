"use client";

import Image from "next/image";
import { CalendarIcon } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

// Define types for post, comment, profile, and likes
interface Profile {
  username: string;
  avatar_url: string;
  id: string;
}

interface Comment {
  id: string;
  content: string;
  profiles: Profile | null;
  likes: number;
}

interface Post {
  likes: number;
  id: string;
  title: string;
  content: string;
  created_at: string;
  profiles: Profile | null;
  cover_image_url: string;
}

const isValidUuid = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

export default function PostPage() {
  const supabase = createClient();
  const { id } = useParams();
  const postId = Array.isArray(id) ? id[0] : id; // Normalize id to string
  const [post, setPost] = useState<Post | null>(null);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const logView = async (postId: string) => {
    const viewedPosts = JSON.parse(localStorage.getItem("viewedPosts") || "[]");

    if (!viewedPosts.includes(postId)) {
      const { error } = await supabase.from("views").insert({ post_id: postId });

      if (error) {
        console.error("Error logging view:", error);
      } else {
        localStorage.setItem("viewedPosts", JSON.stringify([...viewedPosts, postId]));
      }
    }
  };

  const fetchPost = async () => {
    if (!postId || !isValidUuid(postId)) {
      setError("Invalid Post ID");
      return;
    }

    try {
      setLoading(true);
      const { data: postData, error: postError } = await supabase
        .from("posts")
        .select("*, profiles(username, avatar_url, id)")
        .eq("id", postId)
        .single();

      if (postError) throw postError;

      setPost(postData as Post);

      const { data: commentsData, error: commentsError } = await supabase
        .from("comments")
        .select("*, profiles(username, avatar_url, id)")
        .eq("post_id", postId);

      if (commentsError) throw commentsError;
      setComments(commentsData as Comment[]);

      const { data: tagsData, error: tagsError } = await supabase
        .from("post_tags")
        .select("*, tags(name)")
        .eq("post_id", postId);

      if (tagsError) throw tagsError;
      setTags(tagsData ? tagsData.map((postTag: any) => postTag.tags.name) : []);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchPost();
      logView(postId);
    }
  }, [postId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-12 w-4/4 mb-6" />
        <Skeleton className="h-64 w-full mb-6" />
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={index} className="h-6 w-full mb-4" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center">
        <Image src="/404.png" alt="404" width={400} height={400} />
        <p className="text-red-500 mt-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center xs:pl-18">
      <article className="max-w-full py-4 sm:px-32 px-12">
        <ToastContainer />
        {post && (
          <div>
            <header className="mb-4 sm:mb-8">
              <h1 className="text-2xl sm:text-4xl font-extrabold mb-2 px-4">{post.title}</h1>
              <div className="flex items-center flex-wrap space-x-2 sm:space-x-4 mb-4 px-4">
                <Link href={`/profile/${post.profiles?.id}`} passHref>
                  {post.profiles?.avatar_url ? (
                    <UserAvatar>
                      <AvatarImage
                        src={post.profiles.avatar_url}
                        alt={post.profiles.username}
                      />
                      <AvatarFallback>{post.profiles.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </UserAvatar>
                  ) : (
                    <Skeleton className="h-6 w-6 sm:h-8 sm:w-8 rounded-full" />
                  )}
                  <p className="text-xs sm:text-sm text-gray-500">{post.profiles?.username}</p>
                </Link>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                  <time className="text-xs sm:text-sm text-gray-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </time>
                </div>
              </div>
            </header>
            {/* Render post content, comments, and other sections */}
          </div>
        )}
      </article>
    </div>
  );
}
