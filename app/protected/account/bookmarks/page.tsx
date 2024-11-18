'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { createClient } from '@/utils/supabase/client';
import { toast, ToastContainer } from 'react-toastify';
import Link from 'next/link';
import { BookmarkIcon } from 'lucide-react';

interface BookmarkedPost {
  id: number;
  title: string;
  cover_image_url: string;
  content: string;
  date: string;
}


export default function BookmarkComponent() {
  const supabase = createClient();
  const [bookmarks, setBookmarks] = useState<BookmarkedPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  
  // Fetch bookmarks when the component loads
  async function parseContent(bookmarkContent:string): Promise<string>  {
    const parsedContent = await marked.parse(bookmarkContent);
    return DOMPurify.sanitize(parsedContent)
    .replace(/<[^>]*>?/gm, '') // Remove HTML tags
    .substring(0, 200); 
  }

  //fetch bookmarks

  useEffect(() => {
    const fetchBookmarkedPosts = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData?.user) {
        console.error('Error fetching user or user not logged in:', userError?.message);
        toast.error('Please log in to see your bookmarks.');
        setLoading(false);
        return;
      }

      const userId = userData.user.id;

      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          id,
          created_at,
          posts (
            id,
            title,
            cover_image_url,
            content,
            created_at
          )
        `)
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching bookmarks:', error.message);
        toast.error('Error fetching bookmarks.');
      } else {
        const formattedBookmarks = await Promise.all (
        (data || []).map(async (bookmark: any) => ({
          id: bookmark.id,
          title: bookmark.posts.title,
          cover_image_url: bookmark.posts.cover_image_url,
          content: await parseContent(bookmark.posts.content),
          date: bookmark.posts.created_at,
        }))
      )
    
      setBookmarks(formattedBookmarks);
    }
      setLoading(false);
    
    };

    fetchBookmarkedPosts();
  }, [supabase]);




  // Remove a bookmark
  const removeBookmark = async (id: number) => {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      toast.error('You must log in to remove a bookmark.');
      return;
    }

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)
      .eq('user_id', userData.user.id);

    if (error) {
      console.error('Error removing bookmark:', error.message);
      toast.error('Failed to remove bookmark.');
    } else {
      setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id));
      toast.success('Bookmark removed.');
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto py-8 px-4 md:px-6">
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <ToastContainer />
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl">My Bookmarked Posts</CardTitle>
            <CardDescription>Your saved articles for later reading</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookmarks.length === 0 ? (
            <p>No bookmarks found. Start bookmarking your favorite posts!</p>
          ) : (
            bookmarks.map((bookmark) => (
              <Card
              key={bookmark.id}
              className="transition-transform transform hover:scale-105 hover:shadow-lg"
            >
                <Link href={`/protected/account/bookmarks/view/${bookmark.id}`} passHref>
                {bookmark.cover_image_url && (
              <div className="relative h-48">
                <img
                  src={bookmark.cover_image_url}
                  alt={bookmark.title || "Cover Image"}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
                <div className="flex-1 p-4">
                  <h3 className="text-lg font-semibold truncate">{bookmark.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {bookmark.content}
                  </p>
                  <div className="flex items-center mt-2 space-x-2">
                    <Badge variant="secondary">{new Date(bookmark.date).toLocaleDateString()}</Badge>
                  </div>
                </div>
            </Link>
                 {/* <div className="flex flex-row mt-3 sm:mt-0 sm:ml-4 space-x-2"> */}
                  <CardFooter className="flex justify-end gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeBookmark(bookmark.id)}
                  >
                    Remove
                  </Button>
                  </CardFooter>
                {/* </div> */}
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// SkeletonLoader component for loading state
const SkeletonLoader = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, index) => (
      <div key={index} className="p-4 border border-gray-200 rounded-md shadow-sm animate-pulse">
        <div className="h-48 bg-gray-300 rounded-md mb-4"></div>
        <div className="space-y-2">
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);
