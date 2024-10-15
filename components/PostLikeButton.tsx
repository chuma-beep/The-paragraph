'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { MdFavorite } from 'react-icons/md';

interface LikeButtonProps {
  postId: string; // The ID of the post to like
}

const PostLikeButton = ({ postId }: LikeButtonProps) => {
  const supabase = createClient();
  const [likesCount, setLikesCount] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false); // Track whether the post is liked
  const [isLiking, setIsLiking] = useState<boolean>(false); // Prevent multiple clicks during the request

  // Fetch likes from Supabase and check localStorage for the liked state
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

      // Retrieve liked state from localStorage
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
      if (likedPosts[postId]) {
        setIsLiked(true); // Set the liked state from localStorage
      }
    };

    fetchLikes();
  }, [postId, supabase]);

  const handleLike = async () => {
    if (isLiking) return; 

    setIsLiking(true); // Disable button during request

    try {
      // Increase the like count in the 'posts' table
      await supabase
        .from('posts')
        .update({ likes: likesCount + 1 })
        .eq('id', postId);

      setLikesCount(likesCount + 1); // Update the like count in the UI

      // Save liked state in localStorage
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
      likedPosts[postId] = true;
      localStorage.setItem('likedPosts', JSON.stringify(likedPosts));

      setIsLiked(true); // Update the liked state in the component
    } catch (error) {
      console.error('Error handling like:', error);
    } finally {
      setIsLiking(false); // Re-enable the button
    }
  };

  return (
    <button
      data-testid="Like-Post"
      onClick={handleLike}
      className={`group relative transition-all duration-300 ease-out bg-transparent hover:bg-transparent text-gray-300 ${
        isLiking ? 'cursor-not-allowed opacity-70' : ''
      }`}
      disabled={isLiking} // Disable while the like is being processed
    >
      <span className="relative z-10 flex items-center justify-center">

        <MdFavorite
          className={`w-6 h-6  transition-colors duration-300  ${
            isLiked ? 'text-red-500' : 'text-gray-300 hover:text-red-500'
            }`}
            />
        <span className="ml-2 font-medium">{likesCount}</span>
      </span>
    </button>
  );
};

export default PostLikeButton;
