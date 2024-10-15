'use client'

import { useState, useEffect } from 'react'
import { Bookmark } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { createClient } from '@/utils/supabase/client'

interface BlogBookmarkButtonProps {
  postId: string;
}

export function BlogBookmarkButton({ postId }: BlogBookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const checkBookmark = async () => {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('post_id', postId)
        .single()

      if (error) {
        console.error('Error checking bookmark status:', error.message)
        return
      }

      setIsBookmarked(!!data)
    }

    checkBookmark()
  }, [postId, supabase])

  const handleBookmark = async () => {
    if (isBookmarked) {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('post_id', postId)

      if (error) {
        console.error('Error removing bookmark:', error.message)
        return
      }

      setIsBookmarked(false)
    } else {
      const { error } = await supabase
        .from('bookmarks')
        .insert({ post_id: postId })

      if (error) {
        console.error('Error adding bookmark:', error.message)
        return
      }

      setIsBookmarked(true)
    }
  }

  return (
    <div className="inline-block"> {/* Adjust the class to fit your layout */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={handleBookmark}
              aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this post"}
            >
              <Bookmark
                size={20}
                className={`transition-all duration-300 mt-2 ${
                  isHovered ? 'scale-110' : 'scale-100'
                } ${isBookmarked ? 'fill-blue-400 text-blue-400' : ' fill-gray-300 text-gray-300 hover:fill-blue-400 hover:text-blue-400'}`}
              />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-popover text-popover-foreground">
            <p>{isBookmarked ? 'Bookmarked!' : 'Bookmark this post'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
