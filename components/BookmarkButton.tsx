import { useState } from 'react';
// import { Button } from "@/components/ui/button";
import { FaBookmark, FaRegBookmark } from 'react-icons/fa'; 


import { toast } from 'react-toastify';
import { createClient } from "@/utils/supabase/client";

interface BookmarkButtonProps {
  postId: string; // The ID of the post or draft to bookmark
  isBookmarked: boolean | undefined; // Whether the item is currently bookmarked
  onToggleBookmark: (postId: string) => void; // Function prop for toggling bookmark
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  postId,
  isBookmarked,
  //onToggleBookmark,
}) => {
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleToggleBookmark = async (postId: string) => {
    setLoading(true);

    try {
      const { data: bookmarks, error: bookmarksError } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('post_id', postId);

      if (bookmarksError) throw bookmarksError;

      if (bookmarks.length > 0) {
        // Remove bookmark
        const { error: deleteError } = await supabase
          .from('bookmarks')
          .delete()
          .eq('post_id', postId);

        if (deleteError) throw deleteError;

        toast.success('Bookmark removed!');
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('bookmarks')
          .insert({ post_id: postId });

        if (error) throw error;

        toast.success('Post bookmarked!');
      }

      setBookmarked(!bookmarked);
    } catch (error) {
      console.error('Error updating bookmark:', error);
      toast.error('Failed to update bookmark');
    }

    setLoading(false);
  };

  return (
    <button

      className={`flex items-center justify-center gap-2 transition-colors ${
        bookmarked ? 'text-blue-600 hover:text-blue-700' : 'text-gray-300  hover:text-blue-500'
      }`}
      onClick={() => handleToggleBookmark(postId)} // Corrected prop name from onToggleBookmark to onClick
      disabled={loading}
    >
      {bookmarked ? <FaBookmark /> : <FaBookmark />}
      {loading ? 'Loading...' : bookmarked ? 'Bookmarked' : ''}
    </button>
  );
};

export default BookmarkButton;
