"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { UserAvatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { marked } from "marked";
import DOMPurify from "dompurify";
import BookmarkButton from "@/components/BookmarkButton";
import { toast } from "react-toastify";
// import LikeButton from "@/components/LikeButton";
import PostLikeButton from "@/components/PostLikeButton";
import PostCard from "./PostCard";



interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  likes: number;
  cover_image_url?: string | null;
  isBookmarked?: boolean ;
  profiles?: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
}

export default function PostList() {
  const supabase = createClient();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, any>>({});
  // const [likes, setLikes] = useState<Record<string, any>>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});
  const [postList, setPostList] = useState<Post[]>(posts);



  // Fetch all posts, comments, and bookmark statuses
  const fetchPosts = useCallback(async () => {
    if (!hasMore) return;

    setLoading(true);
    try {
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select(
          `
          *,
          profiles (
            id,
            username,
            avatar_url
          )
        `
        )
        .order("created_at", { ascending: false })
        .range((page - 1) * 5, page * 5 - 1);
       console.log(postsData);
      if (postsError) throw postsError;

      if (postsData.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prevPosts) => [
          ...prevPosts,
          ...postsData.filter((post) => !prevPosts.some((p) => p.id === post.id)),
        ]);

        // Fetch comments for the new posts
        const commentsData: Record<string, any> = {};
        await Promise.all(
          postsData.map(async (post) => {
            const { data: postComments, error: commentsError } = await supabase
              .from("comments")
              .select("*")
              .eq("post_id", post.id);

            if (!commentsError) {
              commentsData[post.id] = postComments || [];
            }
          })
        );
        setComments((prevComments) => ({ ...prevComments, ...commentsData }));

      

        // Fetch bookmark statuses for the new posts
        const { data: bookmarkData, error: bookmarkError } = await supabase
          .from("bookmarks")
          .select("post_id");

        if (bookmarkError) throw bookmarkError;

        const bookmarkStatus: Record<string, boolean> = {};
        bookmarkData.forEach((bookmark) => {
          bookmarkStatus[bookmark.post_id] = true;
        });
        setBookmarks(bookmarkStatus);
      }
    } catch (error) {
      if ((error as Error).message.includes("Requested range not satisfiable")) {
        setHasMore(false);
      } else {
        setError((error as Error).message);
      }
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, supabase]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const lastPostElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleToggleBookmark = (postId: string) => {
    setBookmarks((prevBookmarks) => ({
      ...prevBookmarks,
      [postId]: !prevBookmarks[postId],
    }));
  };



  // const renderPostCard = (post: Post, index: number) => {
  //   const [truncatedContent, setTruncatedContent] = useState<string>("");
  
  //   useEffect(() => {
  //     const processContent = async () => {
  //       try {
  //         const htmlContent = await Promise.resolve(marked(String(post.content)));
  //         const sanitizedHtmlContent = DOMPurify.sanitize(htmlContent);
  //         const plainTextContent = sanitizedHtmlContent.replace(/<[^>]*>?/gm, "");
  //         const truncated = plainTextContent.substring(0, 100) + "...";
  //         setTruncatedContent(truncated);
  //       } catch (error) {
  //         console.error("Error processing content:", error);
  //       }
  //     };
  
  //     processContent();
  //   }, [post.content]); // Re-run if `post.content` changes
  
  //   const isLastElement = posts.length === index + 1;
  //   const author = post.profiles || { username: "Unknown", avatar_url: null };
  

  //   return (
  //     <div
  //       key={`${post.id}-${index}`}
  //       className="w-full max-w-full mx-auto mb-6 transition-transform duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
  //       >
  //       <Card
  //         ref={isLastElement ? lastPostElementRef : null}
  //         className="w-full px-0"
  //       >
  //         <Link href={`/post/${post.id}`} passHref>
  //           <span className="w-full">
  //             <CardHeader className="p-0">
  //               <Image
  //                 src={post.cover_image_url || "/placeholder.svg"}
  //                 alt={post.title}
  //                 width={600}
  //                 height={300}
  //                 className="w-full h-60 object-cover rounded-t-lg"
  //               />
  //             </CardHeader>
  //             <CardContent className="p-4">
  //               <h3 className="text-2xl font-semibold mb-2 hover:text-blue-400 transition-colors duration-300">
  //                 {post.title}
  //               </h3>
  //               <p className="text-gray-700 line-clamp-3">
  //                 {truncatedContent}
  //               </p>
  //             </CardContent>
  //           </span>
  //         </Link>
  //         <CardFooter className="flex justify-between items-center p-4">
  //           <div className="flex flex-row items-center space-x-4">
  //             <span className="flex items-center text-gray-600">
  //                   <PostLikeButton postId={post.id} />

  //             </span>
  //             <span className="flex items-center text-gray-600">
  //               <MessageCircle className="w-5 h-5 mr-1" />
  //               {comments[post.id]?.length || 0}
  //             </span>
  //             <div className="relative">
  //               <BookmarkButton
  //                 postId={post.id}
  //                 isBookmarked={bookmarks[post.id] || post.isBookmarked}
  //                 onToggleBookmark={handleToggleBookmark}
  //               />
  //             </div>
  //           </div>

  //           <div className="flex flex-row items-center space-x-2">
  //             <Link href={`/profile/${post.profiles?.id}`} passHref>
  //               <span className="flex items-center space-x-2 hover:underline">
  //                 <UserAvatar className="w-8 h-8">
  //                   <AvatarImage
  //                     src={author.avatar_url || "/placeholder-avatar.svg"}
  //                     alt={author.username}
  //                     onClick={(e) => e.stopPropagation()}
  //                   />
  //                   <AvatarFallback>
  //                     {author.username?.charAt(0).toUpperCase() || "U"}
  //                   </AvatarFallback>
  //                 </UserAvatar>
  //                 <span className="text-sm text-gray-600">
  //                   {author.username || "Unknown"}
  //                 </span>
  //               </span>
  //             </Link>
  //           </div>
  //         </CardFooter>
  //       </Card>
  //     </div>
  //   );
  // };





  return (
    <div className="container mx-auto" >
      {posts.length === 0 && loading && (
        <div className="flex flex-col items-center gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="w-full max-w-full min-w-[60vw] mx-auto mb-6 p-4">
              <CardHeader className="p-0">
                <Skeleton height={300} width="100%" />
              </CardHeader>
              <CardContent className="p-4">
                <Skeleton height={30} width="80%" />
                <Skeleton height={20} count={3} />
              </CardContent>
              <CardFooter className="flex justify-between items-center p-4">
                <Skeleton width={50} />
                <Skeleton width={50} />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      {!loading && error && (
        <div className="text-red-500">Sorry Please Try Again</div>
      )}
      {/* <div className="grid grid-cols-1 gap-4">
        {posts.map(renderPostCard)}
      </div> */}
          <div className="grid grid-cols-1 gap-4">
        {posts.map((post, index) => (
          <PostCard
            key={post.id}
            post={post}
            comments={comments}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            lastPostElementRef={lastPostElementRef}
            isLast={posts.length === index + 1}
          />
        ))}
      </div>
      {loading && posts.length > 0 && <Skeleton count={3} height={150} />}
    </div>
  );
}




// import PostCard from "./PostCard"; // Adjust the path based on your folder structure

// export default function PostList() {
//   // ...rest of the PostList code...

//   return (
//     <div className="container mx-auto">
//       {posts.length === 0 && loading && (
//         <div className="flex flex-col items-center gap-6">
//           {Array.from({ length: 6 }).map((_, index) => (
//             <Card key={index} className="w-full max-w-full min-w-[60vw] mx-auto mb-6 p-4">
//               <CardHeader className="p-0">
//                 <Skeleton height={300} width="100%" />
//               </CardHeader>
//               <CardContent className="p-4">
//                 <Skeleton height={30} width="80%" />
//                 <Skeleton height={20} count={3} />
//               </CardContent>
//               <CardFooter className="flex justify-between items-center p-4">
//                 <Skeleton width={50} />
//                 <Skeleton width={50} />
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//       )}
//       {!loading && error && (
//         <div className="text-red-500">Sorry, Please Try Again</div>
//       )}
//       <div className="grid grid-cols-1 gap-4">
//         {posts.map((post, index) => (
//           <PostCard
//             key={post.id}
//             post={post}
//             comments={comments}
//             bookmarks={bookmarks}
//             onToggleBookmark={handleToggleBookmark}
//             lastPostElementRef={lastPostElementRef}
//             isLast={posts.length === index + 1}
//           />
//         ))}
//       </div>
//       {loading && posts.length > 0 && <Skeleton count={3} height={150} />}
//     </div>
//   );
// }
