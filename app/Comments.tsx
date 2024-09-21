'use client';

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';


interface CommentFormProps {
  postId: number | string;
}


const CommentForm: React.FC<CommentFormProps> = ({ postId }) => {
  const supabase = createClient();
  const [comment, setComment] = useState('');

  const submitComment = async () => {
    const { data, error } = await supabase
      .from('comments')
      .insert([{ post_id: postId, user_id: 'example_user', content: comment }]);

    if (error) {
      console.error('Error submitting comment:', error);
    } else {
      console.log('Comment submitted:', data);
      setComment('');
    }
  };

  return (
    <div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a comment..."
      />
      <button onClick={submitComment}>Submit Comment</button>
    </div>
  );
};

export default CommentForm;
