

'use client';

import { useState, useEffect } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa'; 
import { toast } from 'react-toastify';
import { createClient } from "@/utils/supabase/client";
import { Tooltip } from 'react-tooltip'

interface BookmarkButtonProps {
  postId: string; 
  isBookmarked: boolean | undefined; 
  onToggleBookmark: (postId: string) => void;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  postId,
  isBookmarked,
}) => {
  const supabase = createClient();
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [loading, setLoading] = useState(false);

  // Effect to sync state with the initial bookmarked prop or localStorage
  useEffect(() => {
    try {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '{}');
      setBookmarked(bookmarks[postId] || isBookmarked);
    } catch {
      setBookmarked(isBookmarked);
    }
  }, [postId, isBookmarked]);

  const handleToggleBookmark = async () => {
    if (!userId) {
      toast.error('User not logged in');
      return;
    }

    setLoading(true);
    try {
      const { data: bookmarks, error: bookmarksError } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('post_id', postId);

      if (bookmarksError) throw bookmarksError;

      if (bookmarks.length > 0) {
        const { error: deleteError } = await supabase
          .from('bookmarks')
          .delete()
          .eq('post_id', postId)

        if (deleteError) throw deleteError;

        toast.success('Bookmark removed!');
        setBookmarked(false);

        // Update localStorage
        const bookmarksInLocal = JSON.parse(localStorage.getItem('bookmarks') || '{}');
        delete bookmarksInLocal[postId];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarksInLocal));
      } else {
        const { error } = await supabase
          .from('bookmarks')
          .insert({ post_id: postId });

        if (error) throw error;

        toast.success('Post bookmarked!');
        setBookmarked(true);

        // Update localStorage
        const bookmarksInLocal = JSON.parse(localStorage.getItem('bookmarks') || '{}');
        bookmarksInLocal[postId] = true;
        localStorage.setItem('bookmarks', JSON.stringify(bookmarksInLocal));
      }
    } catch (error) {
      console.error('Error updating bookmark:', error);
      toast.error('Failed to update bookmark');
    }
    setLoading(false);
  };

  return (
    <button
      data-tooltip-content={'Bookmark'}
      aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
      className={`flex items-center justify-center gap-2 transition-colors ${
        bookmarked ? 'text-blue-600 hover:text-blue-700' : 'text-gray-300 hover:text-blue-500'
      }`}
      onClick={handleToggleBookmark} 
      disabled={loading}
    >
      <Tooltip id="my-tooltip" />
      {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
      {loading ? 'loading' : bookmarked ? 'Bookmarked' : ''}
    </button>

  );
};

export default BookmarkButton;
