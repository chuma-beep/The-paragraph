
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';


interface LikeButtonProps {
    postId: string; // The ID of the post to like
    }



const PostLikeButton = ({ postId }: LikeButtonProps) => {
  const supabase = createClient();
  const [likesCount, setLikesCount] = useState<number>(0);
  const [isLiking, setIsLiking] = useState<boolean>(false); // Manage loading state

  useEffect(() => {
    const fetchLikes = async () => {
      const { data: post } = await supabase
        .from('posts')
        .select('likes')
        .eq('id', postId)
        .single();
      
      if (post) {
        setLikesCount(post.likes || 0); // Default to 0 if likes is null
      }
    };

    fetchLikes();
  }, [postId, supabase]);

  const handleLike = async () => {
    setIsLiking(true); // Set loading state

    try {
      // Increase the like count in the 'posts' table
      await supabase
        .from('posts')
        .update({ likes: likesCount + 1 })
        .eq('id', postId);

      setLikesCount(likesCount + 1);
    } catch (error) {
      console.error('Error handling like:', error);
    } finally {
      setIsLiking(false); // Reset loading state
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`group relative transition-all duration-300 ease-out bg-white hover:bg-gray-100 text-gray-700 ${
        isLiking ? 'cursor-not-allowed opacity-70' : ''
      }`}
      disabled={isLiking}
    >
      <span className="relative z-10 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5 text-red-500 scale-110 transition-all duration-300"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        <span className="ml-2 font-medium text-red-500">
          {likesCount} 
          {/* {likesCount === 1 ? 'Like' : 'Likes'} */}
        </span>
      </span>
    </button>
  );
};

export default PostLikeButton;
