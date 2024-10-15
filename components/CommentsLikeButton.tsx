


'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { MdFavorite } from 'react-icons/md';


interface CommentsLikeButtonProps {
  commentId: string | number; // Ensure this matches your usage
}

const CommentsLikeButton = ({ commentId }: CommentsLikeButtonProps) => {
  const supabase = createClient();
  const [likesCount, setLikesCount] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isLiking, setIsLiking] = useState<boolean>(false); // Manage loading state

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const { data: comments, error} = await supabase
          .from('comments')
          .select('likes')
          .eq('id', commentId)
          .single();

        if (error) {
          console.error('Fetch Error:', error.message);
        } else if (comments) {
          setLikesCount(comments.likes || 0); // Default to 0 if likes is null
        }

       const likedComments = JSON.parse(localStorage.getItem('likedPosts') || '{}');
       if(likedComments[commentId]){
        setIsLiked(true)
       }

        
      } catch (err) {
        console.error('Fetch Error:', err);
      }
    };

    fetchLikes();
  }, [commentId, supabase]);

  const handleLike = async () => {
    if(isLiking) return;

    setIsLiking(true); // Set loading state

    try {
      // Increase the like count in the 'comments' table
      const { error } = await supabase
        .from('comments')
        .update({ likes: likesCount + 1 })
        .eq('id', commentId);

       const likedComments = JSON.parse(localStorage.getItem('likedComments') || '{}');
       likedComments[commentId]  = true
       localStorage.setItem('likedComments', JSON.stringify(likedComments));

      setIsLiked(true)
      if (error) {
        console.error('Update Error:', error.message);
      } else {
        setLikesCount(likesCount + 1);
      }
    } catch (err) {
      console.error('Update Error:', err);
    } finally {
      setIsLiking(false); // Reset loading state
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`group relative transition-all duration-300 ease-out bg-transparent hover:bg-transparent text-gray-700 ${
        isLiking ? 'cursor-not-allowed opacity-70' : ''
      }`}
      disabled={isLiking}
    >
      <span className="relative z-10 flex items-center justify-center">
        <MdFavorite className={`w-6 h-6 transition-colors duration-300 ${
          isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
          }`}/>
        <span className="ml-2 font-medium text-gray-700">
          {likesCount} 
        </span>
      </span>
    </button>
  );
};

export default CommentsLikeButton;
