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
  const [isLiked, setIsLiked] = useState<boolean>(false); 
  const [isLiking, setIsLiking] = useState<boolean>(false); 


  //fecth likes check is post is liked and set the like count 
  useEffect(() => {
    const fetchLikes = async () => {
      const { data: post } = await supabase
        .from('posts')
        .select('likes')
        .eq('id', postId)
        .single();

      if (post) {
        setLikesCount(post.likes || 0); 
      }

      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
      if (likedPosts[postId]) {
        setIsLiked(true); 
      }
    };

    fetchLikes();
  }, [postId, supabase]);

  const handleLike = async () => {
    if (isLiking) return; 

    setIsLiking(true); 

    try {
      // Increase the like count in the 'posts' table
      await supabase
        .from('posts')
        .update({ likes: likesCount + 1 })
        .eq('id', postId);

      setLikesCount(likesCount + 1); 

      // Save liked state in localStorage
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
      likedPosts[postId] = true;
      localStorage.setItem('likedPosts', JSON.stringify(likedPosts));

      setIsLiked(true); 
    } catch (error) {
      console.error('Error handling like:', error);
    } finally {
      setIsLiking(false); 
    }
  };

  return (
    <button
      data-testid="Like-Post"
      onClick={handleLike}
      className={`group relative transition-all duration-300 ease-out bg-transparent hover:bg-transparent text-gray-300 ${
        isLiking ? 'cursor-not-allowed opacity-70' : ''
      }`}
      disabled={isLiking} 
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
