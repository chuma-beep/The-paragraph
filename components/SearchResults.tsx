
'use client'

import React from 'react';

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string | null;
  likes: number | null;
  cover_image_url: string | null;
  user_id: string | null;
  profile_id: string | null;
  full_name: string | null;
}

interface SearchResultsProps {
  results: Post[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  return (
    <div className="w-full max-w-md mx-auto mt-4">
      {results.length > 0 ? (
        <ul className="space-y-4">
          {results.map((post) => (
            <li key={post.id} className="p-4 border rounded-md flex flex-col">
              {post.cover_image_url && (
                <img
                  src={post.cover_image_url}
                  alt={post.title}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
              )}
              <h3 className="text-lg font-semibold">{post.title}</h3>
              <p className="text-sm text-gray-600">{post.content}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                <span>{`Author: ${post.full_name}`}</span>
                <span>{`Likes: ${post.likes || 0}`}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No results found.</p>
      )}
    </div>
  );
};

export default SearchResults;
