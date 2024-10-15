import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
// import { MessageCircle } from "lucide-react";
import { BiSolidMessageRounded } from "react-icons/bi";

import Image from "next/image";

import { UserAvatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { marked } from "marked";
import DOMPurify from "dompurify";
import BookmarkButton from "@/components/BookmarkButton";
import PostLikeButton from "@/components/PostLikeButton";

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  likes: number;
  cover_image_url?: string | null;
  isBookmarked?: boolean;
  profiles?: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
}

interface PostCardProps {
  post: Post;
  comments: Record<string, any>;
  bookmarks: Record<string, boolean>;
  onToggleBookmark: (postId: string) => void;
  lastPostElementRef: (node: HTMLElement | null) => void;
  isLast: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, comments, bookmarks, onToggleBookmark, lastPostElementRef, isLast }) => {
  const [truncatedContent, setTruncatedContent] = useState<string>("");

  useEffect(() => {
    const processContent = async () => {
      try {
        const htmlContent = await Promise.resolve(marked(String(post.content)));
        const sanitizedHtmlContent = DOMPurify.sanitize(htmlContent);
        const plainTextContent = sanitizedHtmlContent.replace(/<[^>]*>?/gm, "");
        const truncated = plainTextContent.substring(0, 100) + "...";
        setTruncatedContent(truncated);
      } catch (error) {
        // console.error("Error processing content:", error);
        setTruncatedContent("Error processing content");
      }
    };

    processContent();
  }, [post.content]);

  const author = post.profiles || { username: "Unknown", avatar_url: null };

  return (
    <div
      key={post.id}
      ref={isLast ? lastPostElementRef : null}
      className="w-full max-w-full min-w-full mx-auto mb-6 transition-transform duration-300 ease-in-out transform hover:scale-105 sm:hover:ml-4 cursor-pointer"
    >
      <Card className="w-full  px-0">
        <Link href={`/post/${post.id}`} passHref>
          <span className="w-full">
            <CardHeader className="p-0">
              <Image
                src={post.cover_image_url || "/placeholder.svg"}
                alt={post.title}
                width={600}
                height={300}
                className="w-full h-60 object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent className="p-2">
              <h3 className="text-2xl font-semibold mb-2  transition-colors duration-300">
                {post.title}
              </h3>
              <p className="text-gray-700 line-clamp-3">{truncatedContent}</p>
            </CardContent>
          </span>
        </Link>
        <CardFooter className="flex justify-between items-center p-4">
          <div className="flex flex-row items-center space-x-2">
            <span className="flex items-center text-gray-600 bg-transparent">
              <PostLikeButton postId={post.id} />
            </span>
            <span className="flex items-center text-gray-300">
              <BiSolidMessageRounded  className="w-5 h-5 mr-1 fill-gray-300" />
              {comments[post.id]?.length || 0}
            </span>
            <div className="relative">
              <BookmarkButton
                postId={post.id}
                isBookmarked={bookmarks[post.id] || post.isBookmarked}
                onToggleBookmark={onToggleBookmark}
                
              />
            </div>
          </div>

          <div className="flex flex-row items-center space-x-2">
            <Link href={`/profile/${post.profiles?.id}`} passHref>
              <span className="flex items-center space-x-2 hover:underline">
                <UserAvatar className="w-8 h-8">
                  <AvatarImage
                    src={author.avatar_url || "/placeholder-avatar.svg"}
                    alt={author.username}
                  />
                  <AvatarFallback>
                    {author.username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </UserAvatar>
                <span className="text-sm text-gray-600">
                  {author.username || "Unknown"}
                </span>
              </span>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PostCard;
