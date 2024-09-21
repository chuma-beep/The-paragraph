"use client";

import Image from "next/image";
import { CalendarIcon, ClockIcon, SendIcon } from "lucide-react";
import { useState, useEffect, useCallback, use } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { UserAvatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView, lightDefaultTheme } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import '@blocknote/core/fonts/inter.css';
import { Skeleton } from "@/components/ui/skeleton";
import { Database as DB } from '@/lib/database.types';
import { MdOutlineDelete } from "react-icons/md";
import { BlogFloatingBookmarkButton } from "../BlogFloatingBookmarkButton";
// import LikeButton from "@/components/LikeButton";
import CommentsLikeButton from "@/components/CommentsLikeButton";
import PostLikeButton from "@/components/PostLikeButton";
import Link from "next/link";






interface Profile {
  username: string;
  avatar_url: string; 
  id: string;
}

interface Comment {
  id: string ;
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
  read_time: number;
  profiles: Profile | null;
  cover_image_url: string; 
  profile_id: string | number;
}

export default function PostPage() {
  const supabase = createClient();
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const editor = useCreateBlockNote();

  const fetchPost = async () => {
    try {
      setLoading(true);
      const { data: postData, error: postError } = await supabase
        .from("posts")
        .select(`
          *,
          profiles(username, avatar_url, id)
        `)
        .eq("id", id)
        .single();

      if (postError) {
        if (postError.code === 'PGRST116') {
          setError("Post not found");
        } else {
          throw postError;
        }
        return;
      }

      setPost(postData as Post);

      const { data: commentsData, error: commentsError } = await supabase
        .from("comments")
        .select(`
          *,
          profiles(username, avatar_url, id)
        `)
        .eq("post_id", id);

      if (commentsError) throw commentsError;

      setComments(commentsData as Comment[]);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const convertMarkdownToBlocks = useCallback(
    async (markdownContent: string) => {
      const blocks = await editor.tryParseMarkdownToBlocks(markdownContent);
      editor.replaceBlocks(editor.document, blocks);
    },
    [editor]
  );

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  useEffect(() => {
    if (post && post.content) {
      convertMarkdownToBlocks(post.content);
    }
  }, [post, convertMarkdownToBlocks]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);



  const fetchLikes = async (postId: string | null, commentId: string | null) => {
    let query = supabase.from('likes').select('*');
  
    if (postId) {
      query = query.eq('post_id', postId);
    } else if (commentId) {
      query = query.eq('comment_id', commentId);
    }
  
    const { data: likes, error } = await query;
  
    if (error) {
      console.error('Error fetching likes:', error);
    } else {
      setLikes(likes.length);  // Assuming you want to set the number of likes
    }
  };
  
  useEffect(() => {
    if (post?.id) {
      fetchLikes(post.id, null);  // Fetch likes for the post
    }
  
    comments.forEach(comment => {
      if (comment.id) {
        fetchLikes(null, comment.id);  // Fetch likes for each comment
      }
    });
  }, [post, comments]);
  
  



  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error("User Error: ", userError.message);
        toast.error("Error fetching user");
        return;
      }

      const userId = userData?.user?.id;
      if (!userId) {
        toast.error("User not authenticated");
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error("Profile Error: ", profileError.message);
        toast.error("Error fetching user profile");
        return;
      }

      const profileId = profileData?.id;
      if (!profileId) {
        toast.error("Profile not found");
        return;
      }

      const { data, error } = await supabase
        .from("comments")
        .insert([{
          post_id: id,
          content: newComment.trim(),
          profile_id: profileId, 
          user_id: userId
        }]);

      if (error) {
        console.error("Insert Error: ", error.message);
        toast.error("Error submitting comment");
      } else {
        fetchPost(); // Refresh comments after submission
        setNewComment("");
        toast.success("Comment submitted successfully");
      }
    }
  };





  const handleDeleteComment = async (commentId: string) => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error("User Error: ", userError.message);
        toast.error("Error fetching user");
        return;
      }

      const userId = userData?.user?.id;
      if (!userId) {
        toast.error("User not authenticated");
        return;
      }

      // Ensure the comment belongs to the current user
      const { data: commentData, error: commentError } = await supabase
        .from("comments")
        .select("user_id")
        .eq("id", commentId)
        .single();

      if (commentError) {
        console.error("Comment Error: ", commentError.message);
        toast.error("Error fetching comment data");
        return;
      }

      if (commentData?.user_id !== userId) {
        toast.error("You are not authorized to delete this comment");
        return;
      }

      const { error: deleteError } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);

      if (deleteError) {
        console.error("Delete Error: ", deleteError.message);
        toast.error("Error deleting comment");
      } else {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId)
        );
        toast.success("Comment deleted successfully");
      }
    } catch (error: any) {
      console.error("Delete Error: ", error.message);
      toast.error("An unexpected error occurred");
    }
  };


   


  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-12 w-4/4 mb-6" />
        <div className="flex items-center space-x-4 mb-6">
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-64 w-full mb-6" />
        <Skeleton className="h-6 w-full mb-4" />
        <Skeleton className="h-6 w-full mb-4" />
        <Skeleton className="h-6 w-full mb-4" />
        <Skeleton className="h-6 w-full mb-4" />
        <Skeleton className="h-6 w-full mb-4" />
        <Skeleton className="h-6 w-full mb-4" />
        <Skeleton className="h-6 w-full mb-4" />
        <Skeleton className="h-6 w-full mb-4" />
        <Skeleton className="h-6 w-full mb-4" />
        <Skeleton className="h-6 w-3/4 mb-4" />
        <Skeleton className="h-6 w-2/3 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-4" />
      </div>
    );
  }

  if (error) return <p>{error}</p>;

  return (
    <article className="max-w-3xl mx-auto px-4 py-8 sm:px-0 lg:px-8">
      <ToastContainer />

      {post && (
        <>
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold mb-2">{post.title}</h1>
            <div className="flex items-center space-x-4 mb-4">
              {/* remenber to check proprely for exitence of profile.id in posts */}
              <Link href={`/profile/${post.profile_id}`} className=" items-center gap-2 flex flex-row"   passHref>
              {post.profiles?.avatar_url ? (
                <UserAvatar>
                  <AvatarImage
                    src={post.profiles.avatar_url}
                    alt={post.profiles.username}
                  />

                  <AvatarFallback>
                    {post.profiles.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </UserAvatar>
              ) : (
                <Skeleton className="h-8 w-8 rounded-full" />
              )}
              <p className="text-sm text-gray-500">{post.profiles?.username}</p>
              </Link>
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4 text-gray-400" />
                <time className="text-sm text-gray-500">
                  {new Date(post.created_at).toLocaleDateString()}
                </time>
              </div>
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">{post.read_time} min read</span>
              </div>
              <div className="flex items-center space-x-2">

                  <BlogFloatingBookmarkButton postId={post.id} />
              </div>
            </div>
          </header>
     <div className="mb-8 aspect-video relative overflow-hidden rounded-lg">
             <Image
               src={post.cover_image_url}
               alt={post.title}
               layout="fill"
               objectFit="cover"
               className="transition-transform duration-300 hover:scale-105"
             />
          </div>

          <BlockNoteView
            theme={lightDefaultTheme}
            editor={editor}
            editable={false}
            autoFocus={false}
          />
          <div className="mt-6 flex items-center space-x-2">
               <PostLikeButton postId={post.id} />
          </div>
          <section className="mt-8">
          <form onSubmit={handleCommentSubmit} className="mt-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
              className="w-full p-2 border rounded"
              placeholder="Add a comment..."
            ></textarea>
            <Button type="submit" className="mt-2">
              Submit
            </Button>
          </form>
            <h2 className="text-2xl font-bold mb-4">Comments</h2>
            {comments.map((comment) => (
              <div key={comment.id} className="border-b py-4">
                <div className="flex items-start gap-4 space-x-2 mb-2">
                  <Link href={`/profile/${comment.profiles?.id}`}  className=" items-center gap-2 flex flex-row"  passHref>
                  {comment.profiles?.avatar_url ? (
                    <UserAvatar className="h-8 w-8 border" >
                      <AvatarImage
                        src={comment.profiles.avatar_url}
                        alt={comment.profiles.username}
                      />
                      <AvatarFallback>
                        {comment.profiles.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </UserAvatar>
                  ) : (
                    <Skeleton className="h-6 w-6 rounded-full" />
                  )}
                  <p className="font-semibold">{comment.profiles?.username}</p>
                  </Link>
                </div>
                <div className="grid gap-1.5">

                <div className="w-full flex justify-between">

                <p className="text-gray-600">{comment.content}</p>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="flex items-center text-red-500 hover:text-red-700 transition ml-4"
                    >
                  
                  <MdOutlineDelete className="text-red-600" />
                  </button>
                    </div>
                <div className="mt-2 flex items-center space-x-2">
                    <CommentsLikeButton commentId={comment.id} />

                </div>
                </div>
              </div>
            ))}
          </section>
        </>
      )}
    </article>
  );
}

