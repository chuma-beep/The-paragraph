// src/components/PostOrCommentComponent.tsx
import React, { useEffect, useState } from 'react';
import { handleLike } from '../utils/handleLike';  // Import the like handler function
import { useFetchLikes } from '../hooks/useFetchLikes';  // Import the custom hook to fetch likes

interface LikeProps {
  id: string;
  type: 'comment' | 'post';
}

const LikeButton: React.FC<LikeProps> = ({ id, type }) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);

  // Use custom hook to fetch like data
  const { fetchLikesData } = useFetchLikes();

  useEffect(() => {
    fetchLikesData(id, type, setIsLiked, setLikeCount, setUserId);
  }, [id, type]);

  const handleLikeToggle = async () => {
    if (!userId) {
      alert('You need to be logged in to like!');
      return;
    }
    await handleLike(id, type, userId, setIsLiked, setLikeCount);
  };

  return (
    <button onClick={handleLikeToggle}>
      {isLiked ? 'Unlike' : 'Like'} ({likeCount})
    </button>
  );
};

export default LikeButton;
