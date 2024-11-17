'use client';

import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { createClient } from '@/utils/supabase/client';

interface BlogBookmarkButtonProps {
  postId: string;
}

export function BlogBookmarkButton({ postId }: BlogBookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const initializeBookmarkState = async () => {
      // Check local storage
      const bookmarkedPosts = JSON.parse(localStorage.getItem('bookmarkedPosts') || '{}');
      if (bookmarkedPosts[postId]) {
        setIsBookmarked(true);
        return; 
      }

      // Fallback: Check the database
      const { data, error } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('post_id', postId)
        .maybeSingle();

      if (error) {
        console.error('Error checking bookmark status:', error.message);
        return;
      }

      if (data) {
        setIsBookmarked(true);
        // Update local storage to reflect the database state
        bookmarkedPosts[postId] = true;
        localStorage.setItem('bookmarkedPosts', JSON.stringify(bookmarkedPosts));
      }
    };

    initializeBookmarkState();
  }, [postId, supabase]);

  const handleBookmark = async () => {
    const bookmarkedPosts = JSON.parse(localStorage.getItem('bookmarkedPosts') || '{}');

    if (isBookmarked) {
      // Remove bookmark
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('post_id', postId);

      if (error) {
        console.error('Error removing bookmark:', error.message);
        return;
      }

      delete bookmarkedPosts[postId];
      localStorage.setItem('bookmarkedPosts', JSON.stringify(bookmarkedPosts));
      setIsBookmarked(false);
    } else {
      // Add bookmark
      const { error } = await supabase
        .from('bookmarks')
        .insert({ post_id: postId });

      if (error) {
        console.error('Error adding bookmark:', error.message);
        return;
      }

      bookmarkedPosts[postId] = true;
      localStorage.setItem('bookmarkedPosts', JSON.stringify(bookmarkedPosts));
      setIsBookmarked(true);
    }
  };

  return (
    <div className="inline-block">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={handleBookmark}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this post'}
            >
              <Bookmark
                size={20}
                className={`transition-all duration-300 mt-2 ${
                  isHovered ? 'scale-110' : 'scale-100'
                } ${isBookmarked ? 'fill-blue-400 text-blue-400' : 'fill-gray-300 text-gray-300 hover:fill-blue-400 hover:text-blue-400'}`}
              />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-popover text-popover-foreground">
            <p>{isBookmarked ? 'Bookmarked!' : 'Bookmark this post'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
