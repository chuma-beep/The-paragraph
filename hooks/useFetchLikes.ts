// src/hooks/useFetchLikes.ts
import { supabase } from '../services/supabaseClient';  // Import the Supabase client

export const useFetchLikes = () => {
  const fetchLikesData = async (
    id: string,
    type: 'comment' | 'post',
    setIsLiked: React.Dispatch<React.SetStateAction<boolean>>,
    setLikeCount: React.Dispatch<React.SetStateAction<number>>,
    setUserId: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('User Error: ', userError.message);
      return;
    }

    const currentUserId = userData?.user?.id;
    setUserId(currentUserId);

    if (!currentUserId) {
      return; // User is not logged in
    }

    const columnId = type === 'comment' ? 'comment_id' : 'post_id';

    const { data: existingLike, error: fetchError } = await supabase
      .from('likes')
      .select('*')
      .eq('user_id', currentUserId)
      .eq(columnId, id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Fetch Like Error: ', fetchError.message);
      return;
    }

    setIsLiked(!!existingLike);

    const { data: likeCountData, error: likeCountError } = await supabase
      .from('likes')
      .select('*', { count: 'exact' })
      .eq(columnId, id);

    if (likeCountError) {
      console.error('Error fetching like count:', likeCountError.message);
      return;
    }

    setLikeCount(likeCountData.length);
  };

  return { fetchLikesData };
};
