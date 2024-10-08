import { supabase } from '../services/supabaseClient';
import { SearchParams } from '@/types/search';
import Profile from '../app/protected/account/page';


interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string | null;
  likes: number | null;
  cover_image_url: string | null;
  user_id: string | null;
  profile_id: string | null;
  username: string; // Consider if this is redundant
  description: string;
  url: string;
  profiles?: {
    // id: string;
    username: string;
    avatar_url: string | null;
  }[]; // Changed from single object to array
}




export const searchPosts = async (params: SearchParams): Promise<Post[]> => {
  const { keyword, tags, username } = params;

  const safeAuthorNames = Array.isArray(username) ? username : [];

  let query = supabase
    .from('posts')
    .select(`
      id,
      title,
      content,
      created_at,
      likes,
      cover_image_url,
      user_id,
      profile_id,
      profiles(username, avatar_url)
    `);

  // Debug the query and response
  console.log('Executing Supabase Query with:', { keyword, tags, username });

  if (keyword) {
    const escapedKeyword = keyword.replace(/[%_]/g, '\\$&');
    query = query.or(`title.ilike.%${escapedKeyword}%,content.ilike.%${escapedKeyword}%`);
  }

  if (safeAuthorNames.length > 0) {
    const authorFilters = safeAuthorNames
      .map(name => `profiles.username.ilike.%${name}%`)
      .join(',');
    query = query.or(authorFilters);
  }

  if (tags && tags.length > 0) {
    const { data: postTagsData, error: postTagsError } = await supabase
      .from('post_tags')
      .select('post_id')
      .in('tag_id', tags)
      .neq('post_id', null);

    if (postTagsError) {
      console.error('Error fetching post_tags:', postTagsError);
      return [];
    }

    const postIds = postTagsData.map(pt => pt.post_id);
    const uniquePostIds = Array.from(new Set(postIds));

    if (uniquePostIds.length > 0) {
      query = query.in('id', uniquePostIds);
    } else {
      return [];
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching search results:', error);
    return [];
  }

  console.log('Supabase Query Response:', data); // Log the fetched data

  const results: Post[] = data.map(post => ({
    id: post.id,
    title: post.title,
    content: post.content,
    created_at: post.created_at,
    likes: post.likes,
    cover_image_url: post.cover_image_url,
    user_id: post.user_id,
    profile_id: post.profile_id,
    // description: post.profiles?.[]?.username || 'No username found', // Safely accessing the first profile's username
    // description: post.profiles.map(profile => profile.username).join(', ') || 'No usernames found',
    description: JSON.stringify(post.profiles),
    url: `/posts/${post.id}`,
    username: post.profile_id,
  }));

  return results;
};
