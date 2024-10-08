// src/utils/fetchSearchResults.ts
import { supabase } from '../services/supabaseClient';

interface SearchParams {
  keyword: string;
  tags: string[];
  authorName: string;
}

interface Post {
  id: number;
  title: string;
  description: string;
  author_id: string;
  // username: string; // From profiles table
}

export const fetchSearchResults = async (params: SearchParams): Promise<Post[]> => {
  const { keyword, tags, authorName } = params;

  // Start building the query
  let query = supabase
    .from('posts')
    .select(`
      id,
      title,
      description,
      author_id,
      profiles(full_name)
    `)
    .eq('profiles', 'posts.author_id');

  // Filter by keyword in title or description
  if (keyword) {
    query = query.ilike('title', `%${keyword}%`).or(`description.ilike.%${keyword}%`);
  }

  // Filter by author name
  if (authorName) {
    query = query.ilike('profiles.full_name', `%${authorName}%`);
  }

  // // Filter by tags
  // if (tags.length > 0) {
  //   // Assuming you have a join table 'post_tags' to relate posts and tags
  //   query = query 
  //     .in('id', supabase
  //     .from('post_tags')
  //     .select('post_id')
  //     .in('tag_id', tags));
  // }

  // Execute the query
  const { data, error } = await query;

  if (error) {
    console.error('Error fetching search results:', error);
    return [];
  }

  // Map the data to include full_name from profiles
  const results: Post[] = data.map((post) => ({
    id: post.id,
    title: post.title,
    description: post.description,
    author_id: post.author_id,
    // username: post.profiles.username,
    // Map other fields as necessary
  }));

  return results;
};
