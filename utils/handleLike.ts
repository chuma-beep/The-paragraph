// src/utils/handleLike.ts
import { supabase } from '../services/supabaseClient';  // Import the Supabase client
import { toast } from 'react-toastify';  // Assuming you're using react-toastify for notifications

export const handleLike = async (
  id: string,
  type: 'comment' | 'post',
  userId: string,
  setIsLiked: React.Dispatch<React.SetStateAction<boolean>>,
  setLikeCount: React.Dispatch<React.SetStateAction<number>>
) => {
  try {
    console.log('Starting like operation for ID:', id, 'Type:', type);

    const columnId = type === 'comment' ? 'comment_id' : 'post_id';

    const { data: existingLike, error: fetchError } = await supabase
      .from('likes')
      .select('*')
      .eq('user_id', userId)
      .eq(columnId, id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Fetch Like Error: ', fetchError.message);
      toast.error('Error checking like status');
      return;
    }

    if (existingLike) {
      const { error: deleteError } = await supabase
        .from('likes')
        .delete()
        .eq('id', existingLike.id);

      if (deleteError) {
        console.error('Delete Like Error: ', deleteError.message);
        toast.error('Error removing like');
      } else {
        console.log('Like removed successfully');
        setIsLiked(false);
        setLikeCount((prev) => prev - 1);
      }
    } else {
      const { error: insertError } = await supabase.from('likes').insert([
        {
          user_id: userId,
          [columnId]: id,
        },
      ]);

      if (insertError) {
        console.error('Like Insertion Error: ', insertError.message);
        toast.error('Error adding like');
      } else {
        console.log('Like added successfully');
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    }
  } catch (error: any) {
    console.error('Like Error: ', error.message);
    toast.error('An unexpected error occurred');
  }
};
