


'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

interface Tag {
  id: string;
  name: string;
}

interface PostTagsComponentProps {
  postId: string;
}

export function PostTagsComponent({ postId }: PostTagsComponentProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchPostTags = async () => {
      const { data, error } = await supabase
        .from('post_tags')
        .select(`
          tags(name, id)
        `)
        .eq('post_id', postId);

      if (error) {
        console.error('Error fetching tags for the post:', error.message);
      } else {
        // Assuming data comes as an array of entries where each entry has a 'tags' array
        const fetchedTags = data.flatMap((entry: { tags: Tag[] }) => entry.tags);
        setTags(fetchedTags);
      }
    };

    fetchPostTags();
  }, [postId, supabase]);

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-2">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <span key={tag.id} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg">
              {tag.name}
            </span>
          ))
        ) : (
          // Fallback if no tags are found
          <p>No tags available</p>
        )}
      </div>
    </div>
  );
}
