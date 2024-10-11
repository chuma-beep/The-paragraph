"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import PostCard from "./PostCard";
import Image from "next/image";
import { result } from "lodash";


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






  return (
    <div data-testid="PostList"  className="" >
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
        <div className="text-red-500 w-full align-middle flex flex-col justify-center min-h-full">
          <Image
           src="/404.png"
            width={400}
             height={400}
              alt="Error" />

        <p className="text-center">
          
            Sorry Please Try Again
          </p>
          </div>
      )}
          <div className="grid grid-cols-1 gap-4 w-full min-w-[300]">
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


