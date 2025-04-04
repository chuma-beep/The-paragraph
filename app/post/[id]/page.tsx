"use client";

import Image from "next/image";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
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
import { MdOutlineDelete } from "react-icons/md";
import { BlogBookmarkButton } from "../../../components/BlogFloatingBookmarkButton";
import CommentsLikeButton from "@/components/CommentsLikeButton";
import PostLikeButton from "@/components/PostLikeButton";
import { PostTagsComponent } from '@/components/TagsComponent';
import Link from "next/link";

// import * as Card  from "@/components/ui/card";
// import Markdown from 'markdown-to-jsx'

// Removed unused import
// import TagsPostsPage from '../../tags/[tag]/page';



interface User{
  id: string | number;
}


interface Profile {
  username: string;
  avatar_url: string; 
  id: string;
}

interface Tag {
  name: string;
}

interface PostTag {
  tags: Tag; // Updated to match the select query
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
  read_time: number;
  profiles: Profile | null;
  cover_image_url: string;
  profile_id: string | number;
}

// UUID validation using regex as a fallback
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
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);


  const editor = useCreateBlockNote();
    const logView = async (postId: string) => {
    const viewedPosts = JSON.parse(localStorage.getItem("viewedPosts") || "[]");

    if (!viewedPosts.includes(postId)) {
      const { error } = await supabase.from("views").insert({ post_id: postId });

      if (error) {
        // console.error("Error logging view:", error);
      } else {
        localStorage.setItem("viewedPosts", JSON.stringify([...viewedPosts, postId]));
      }
    }
  };

  /**
   * Fetches the post data, comments, and tags from Supabase.
   * Ensures that the post ID is defined and valid before making queries.
   */
  const fetchPost = async () => {
    if (!postId) {
      setError("Post ID is undefined");
      // Toast.Error("Post ID is undefined");
      return;
    }

    if (!isValidUuid(postId)) { 
      setError("Invalid Post ID format");
      return;
    }

    try {
      setLoading(true);

      // Fetch post data along with profile
      const { data: postData, error: postError } = await supabase
        .from("posts")
        .select(`
          *,
          profiles(username, avatar_url, id)
        `)
        .eq("id", postId)
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

      // Fetch comments for the post
      const { data: commentsData, error: commentsError } = await supabase
        .from("comments")
        .select(`
          *,
          profiles(username, avatar_url, id)
        `)
        .eq("post_id", postId);

      if (commentsError) throw commentsError;
      setComments(commentsData as Comment[]);

      // Fetch tags for the post by joining the post_tags and tags tables
      const { data: tagsData, error: tagsError } = await supabase
        .from("post_tags")
        .select(`*, tags(name)`) 
        .eq("post_id", postId);

      if (tagsError) throw tagsError;

      // Map the tagsData to extract tag names
      const extractedTags = tagsData
        ? tagsData.map((postTag: PostTag) => postTag.tags.name)
        : [];
      setTags(extractedTags);

    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Converts markdown content to BlockNote blocks and updates the editor.
   */
  const convertMarkdownToBlocks = useCallback(
    async (markdownContent: string) => {
      const blocks = await editor.tryParseMarkdownToBlocks(markdownContent);
      editor.replaceBlocks(editor.document, blocks);
    },
    [editor]
  );

  // Fetch post data when 'postId' changes and is valid
  useEffect(() => {
    // console.log("Post ID:", postId); // Debugging line
    if (postId && isValidUuid(postId)) {
      fetchPost();
    } else if (postId) { // If 'postId' exists but is invalid
      setError("Invalid Post ID");
      setLoading(false);
    }
  }, [postId]);



  const customTheme = {
    colors: {
        editor: {
            background: 'rgba(255, 255, 255, 0)', // Fully transparent editor background
            text: "#757575"
            // text: "#616161"
        },
    },
};




  // Convert markdown content to blocks when post is loaded
  useEffect(() => {
    if (post && post.content) {
      convertMarkdownToBlocks(post.content);
    }
  }, [post, convertMarkdownToBlocks]);

  // Display error toast when an error occurs
  // useEffect(() => {
  //   if (error) {
  //     toast.error(error);
  //   }
  // }, [error]);

  /**
   * Fetches likes for a post or comment.
   * @param postId - The ID of the post.
   * @param commentId - The ID of the comment.
   */
  const fetchLikes = async (postId: string | null, commentId: string | null) => {
    let query = supabase.from('likes').select('*');

    if (postId) {
      query = query.eq('post_id', postId);
    } else if (commentId) {
      query = query.eq('comment_id', commentId);
    }

    const { data: likesData, error } = await query;

    if (error) {
      console.error('Error fetching likes:', error);
    } else {
      setLikes(likesData.length);  
    }
  };

  // Fetch likes for post and comments when post or comments change
  useEffect(() => {
    if (post?.id) {
      fetchLikes(post.id, null);  
    }

    comments.forEach(comment => {
      if (comment.id) {
        fetchLikes(null, comment.id);  
      }
    });
  }, [post, comments]);

  /**
   * Handles the submission of a new comment.
   * @param e - The form event.
   */
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        // console.error("User Error: ", userError.message);
        toast.error("Login to comment");
        return;
      }

      const userId = userData?.user?.id;
      if (!userId) {
        toast.error("User not authenticated");
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .eq("id", userId)
        .single();

      if (profileError) {
        // console.error("Profile Error: ", profileError.message);
        toast.error("Error fetching user profile");
        return;
      }

      const profileId = profileData?.id;
      if (!profileId) {
        toast.error("Profile not found");
        return;
      }


     await supabase.from('comments')



      const { data: newCommentData, error } = await supabase
        .from("comments")
        .insert([{
          post_id: postId, 
          content: newComment.trim(),
          profile_id: profileId, 
          user_id: userId
        }])
        .select("id, content, profile_id, profiles(username, avatar_url)");

      if (error) {
        // console.error("Insert Error: ", error.message);
        toast.error("Error submitting comment");
      } else {
        setComments((prevComments: Comment[]) => [
          ...prevComments,
          {
            id: newCommentData[0].id,
            content: newCommentData[0].content,
            profile_id: profileId,
            profiles: {
              username: profileData.username,
              avatar_url: profileData.avatar_url,
              id: profileId,
            },  
            likes: 0,
          }
        ]);

        setNewComment("");
        toast.success("Comment submitted successfully");
      }
    }
  };


   //
   useEffect(() => {
    const fetchUser = async () => {
      const {data: userData, error } = await supabase.auth.getUser();

      if (!error && userData?.user ){
        setCurrentUser({ id: userData.user.id });
      }
    }

  fetchUser();
  }, []);


  const handleDeleteComment = async (commentId: string) => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        // console.error("User Error: ", userError.message);
        toast.error("unauthorized");
        return;
      }


      const userId = userData?.user?.id;
      if (!userId) {
        toast.error("you can't delete another users comment");
        return;
      }

      // Ensure the comment belongs to the current user
      const { data: commentData, error: commentError } = await supabase
        .from("comments")
        .select("user_id")
        .eq("id", commentId)
        .single();

      if (commentError) {
        // console.error("Comment Error: ", commentError.message);
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
        // console.error("Delete Error: ", deleteError.message);
        toast.error("Error deleting comment");
      } else {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId)
        );
        toast.success("Comment deleted successfully");
      }
    } catch (error: any) {
      // console.error("Delete Error: ", error.message);
      toast.error("An unexpected error occurred");
    }
  };



   
  // async function logPostView() {
  //   if (!currentUser) return;
  
  //   const { error } = await supabase
  //     .from('views')
  //     .insert([{ post_id: postId, user_id: currentUser.id }]);
  
  //   if (error) {
  //     console.error("Error logging view:", error);
  //   }
  // }
  
  // useEffect(() => {
  //   if (post) {
  //     logPostView();
  //   }
  // }, [post]);
  

  useEffect(() => {
    if (postId) {
      fetchPost();
      // logView(postId);
    }
  }, [postId]);
    

  // Render loading skeletons while data is being fetched
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
        {/* Repeated skeletons */}
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={index} className="h-6 w-full mb-4" />
        ))}
        <Skeleton className="h-6 w-3/4 mb-4" />
        <Skeleton className="h-6 w-2/3 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-4" />
      </div>
    );
  }

  // Fix the error rendering by using parentheses
  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center">
        <Image src="/404.jpg" alt="404" width={400} height={400} />
        <p className="text-red-500 mt-4">{error}</p>
      </div>
    );
  }

  return (
      <div className="flex flex-col justify-center xs:pl-18" >
    <article className="max-w-full py-4 sm:px-32 px-12">
      <ToastContainer />

      {post && (
        <div>
          <header className="mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-4xl font-extrabold mb-2 px-4">{post.title}</h1>
            <div className="flex items-center flex-wrap space-x-2 sm:space-x-4 mb-4 px-4">
              <Link href={`/profile/${post.profiles?.id}`} className="items-center gap-2 flex flex-row" passHref>
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
              <div className="flex items-center space-x-1 sm:space-x-2">
                <ClockIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                <span className="text-xs sm:text-sm text-gray-500">{post.read_time} min read</span>
              </div>
            </div>
          </header>

          {post.cover_image_url && (
            <div className="mb-6 sm:mb-8 aspect-video relative overflow-hidden rounded-lg">
              <Image
                src={post.cover_image_url}
                alt={post.title}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 hover:scale-105"
              />
            </div>
          )}

          <BlockNoteView
            editor={editor}
            editable={false}
            autoFocus={false}
            theme={customTheme}
            // theme={'light' | 'dark' | undefined}
            className="mt-10 sm:m-6 bg-transparent text-balance text-xs sm:text-base"
          />

          <div className="mt-auto sm:mt-auto flex items-center space-x-4 sm:space-x-6 p-4">
            <PostLikeButton postId={post.id} />
          
            <div className="flex space-x-1 sm:space-x-2">
              <BlogBookmarkButton postId={post.id} />
            </div>
            <PostTagsComponent postId={postId} /> 

          </div>

          <section className="mt-6 sm:mt-8 px-4">
            <form onSubmit={handleCommentSubmit} className="mt-4 sm:mt-8">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="w-full p-2 border rounded text-xs sm:text-sm"
                placeholder="Add a comment..."
              />
              <Button type="submit" className="mt-2">
                Submit
              </Button>
            </form>
            <h2 className="text-lg sm:text-2xl font-bold mb-4">Comments</h2>
            {comments.map((comment) => (
              <div key={comment.id} className="border-b py-2 px-4 sm:py-4">
                <div className="flex items-start gap-2 sm:space-x-2 mb-2">
                  <Link href={`/profile/${comment.profiles?.id}`} className="items-center gap-2 flex flex-row" passHref>
                    {comment.profiles?.avatar_url ? (
                      <UserAvatar className="h-6 w-6 sm:h-8 sm:w-8 border">
                        <AvatarImage
                          src={comment.profiles.avatar_url}
                          alt={comment.profiles.username}
                        />
                      </UserAvatar>
                    ) : (
                      <Skeleton className="h-5 w-5 sm:h-6 sm:w-6 rounded-full" />
                    )}
                    <p className="text-xs sm:text-sm font-semibold">{comment.profiles?.username}</p>
                  </Link>
                </div>
                <div  className="flex flex-row justify-between">
                <div className="grid gap-1.5">
                  <p className="text-xs sm:text-sm text-gray-600">{comment.content}</p>
                  <div className="mt-2 flex items-center space-x-1 sm:space-x-2">
                    <CommentsLikeButton commentId={comment.id} />
                  </div>
                {/* Optionally add delete button if user is authorized */}

                </div>
                      {currentUser?.id === comment.profiles?.id && (
                    <button onClick={() => handleDeleteComment(comment.id)} className="delete-button">
                      <MdOutlineDelete size={20} />
                    </button>
                  )}
                </div>
               
              </div>
            ))}
          </section>
        </div>
      )}
    </article>
    </div>
  );
}