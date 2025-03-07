
'use client';
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import PostCard from "../TagsPostCard";
import { PostWithRelations, Comment, Bookmark, Profile } from "@/types/types"
import Image from "next/image";
import BackButton from "@/components/BackButton";


const supabase = createClient();

export default function TagsPostsPage() {
  const { tag } = useParams();
  const decodedTag = decodeURIComponent(tag as string);
  
  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const observer = useRef<IntersectionObserver | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Function to handle bookmarking
  const onToggleBookmark = (postId: string) => {
    setBookmarks((prevBookmarks) => ({
      ...prevBookmarks,
      [postId]: !prevBookmarks[postId],
    }));
  };

  // Callback for the last post element (for infinite scrolling)
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



  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch tag by name
        const { data: tagData, error: tagError } = await supabase
          .from("tags")
          .select("id")
          .eq("name", decodedTag)
          .single();

        if (tagError || !tagData) {
          throw new Error("Not Found");
        }

        const tagId = tagData.id;

        // Fetch posts associated with the tag with pagination
        const { data: postData, error: postError } = await supabase
          .from("posts")
          .select(`
            *,
            profiles (
              username,
              avatar_url
            ),
            post_tags (
              tag_id
            )
          `)
          .eq("post_tags.tag_id", tagId)
          .range((page - 1) * 10, page * 10 - 1); // Fetch 10 posts per page

        if (postError) throw postError;

        if (!postData || postData.length === 0) {
          setHasMore(false);
        } else {
          // Map posts and ensure `isBookmarked` is always boolean
          const formattedPosts: PostWithRelations[] = postData.map((post: any) => ({
            ...post,
            isbookmarked: post.isbookmarked ?? false,
          }));
          setPosts((prevPosts) => [...prevPosts, ...formattedPosts]);

          // Fetch comments for these posts
          const postIds = formattedPosts.map((post) => post.id);
          const { data: commentsData, error: commentsError } = await supabase
            .from("comments")
            .select("*")
            .in("post_id", postIds);

          if (commentsError) throw commentsError;

          const commentsByPostId: Record<string, Comment[]> = {};
          commentsData.forEach((comment) => {
            if (!commentsByPostId[comment.post_id]) {
              commentsByPostId[comment.post_id] = [];
            }
            commentsByPostId[comment.post_id].push(comment);
          });

          setComments((prevComments) => ({ ...prevComments, ...commentsByPostId }));
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (tag) {
      fetchData();
    }
  }, [tag, supabase, page, decodedTag]);

  if (loading && posts.length === 0) return <Skeleton className="h-12 w-4/4 mb-6" />;

  // if (error) return <p>Error: {error}</p>;
  
  if (error) return (
  <div className="w-full flex flex-col justify-center items-center text-center z-30">
    <BackButton/>
    <Image
     width={800}
     height={800}
     alt="Error Image"
     src={"/404.jpg"}
      />
  <p>
     Not Found
  </p>
  </div>  
);


  // if (posts.length === 0) return <p>No posts found for the tag "{decodedTag}".</p>;
    if (posts.length === 0) return (
      <div className="w-full flex flex-col justify-center items-center  text-center">
        <BackButton/>
        <Image
         width={800}
         height={800}
         alt="Error Image"
         src={"/404.jpg"}
          />
      <p>
         Not Found
         {decodedTag}
      </p>
      </div>  
    );

  return (
    <article className="max-w-3xl mx-auto px-4 py-8 sm:px-0 lg:px-8">
          <BackButton/>
      <h2 className="text-2xl font-bold mb-4">Posts tagged with "{decodedTag}"</h2>
      {posts.map((post, index) => (
        <PostCard
          key={post.id}
          post={post}
          comments={comments}
          bookmarks={bookmarks}
          onToggleBookmark={onToggleBookmark}
          lastPostElementRef={lastPostElementRef}
          isLast={index === posts.length - 1}
        />
      ))}
      {loading && <Skeleton className="h-12 w-4/4 mb-6" />}
    </article>
  );
}
