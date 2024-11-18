"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import '@blocknote/core/fonts/inter.css';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation'

interface Profile {
  username: string;
  avatar_url: string; 
  id: string;
}

interface Bookmarks {
  likes: number;
  id: string;
  title: string;
  content: string;
  created_at: string;
  read_time: number;
  cover_image_url: string;
  profile_id: string | number;
}

const isValidUuid = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

export default function EditPage() {
  const router = useRouter();
  const supabase = createClient();
  const { id } = useParams();
  const bookmarkId = Array.isArray(id) ? id[0] : id;
  const [bookmarks, setBookmarks] = useState<Bookmarks | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const editor = useCreateBlockNote();

  const fetchBookmarks = async () => {
  
    if (!bookmarkId || !isValidUuid(bookmarkId)) {
      setError(bookmarkId ? "Invalid Bookmark ID format" : "Post ID is undefined");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data: bookmarksData, error: bookmarksError } = await supabase
      .from("bookmarks")
      .select(`
        id,
        posts (
          title,
          cover_image_url,
          content,
          created_at,
          profiles (
            username,
            avatar_url
          )
        )
      `)
      .eq("id", bookmarkId)
      .single();
    

      if (bookmarksError) {
        setError(bookmarksError.code === 'PGRST116' ? "Post not found" : bookmarksError.message);
        return;
      }

      setBookmarks(bookmarksData as unknown as Bookmarks);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };





  const convertMarkdownToBlocks = useCallback(
    async (markdownContent: string) => {
      const blocks = await editor.tryParseMarkdownToBlocks(markdownContent);
      editor.replaceBlocks(editor.document, blocks);
    },
    [editor]
  );

  useEffect(() => {
    if (bookmarkId && isValidUuid(bookmarkId)) fetchBookmarks();
  }, [bookmarkId]);

  const handlePublish = async (id: string) => {
    setLoading(true);

    try {
      const { data: bookmark, error: fetchError } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !bookmark) throw new Error(fetchError?.message || 'Bookmark not found');

      const { error: insertError } = await supabase
        .from('posts')
        .insert([{
          id: bookmark.id,
          title: bookmark.title,
          content: bookmark.content,
          user_id: bookmark.user_id,
          cover_image_url: bookmark.cover_image_url,
        }]);

      if (insertError) {
         throw new Error(insertError.message);
      } else {
        toast.success('Post published successfully');
      }

      const { error: deleteError } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('Error deleting bookmark:', deleteError.message);
        toast.error('Post published, but failed to delete the bookmark');
      } else {
        setBookmarks((prevBookmarks) => prevBookmarks?.id !== id ? prevBookmarks : null);
      }

      toast.success('Post published successfully!');
    } catch (error) {
      console.error('Error publishing bookmark:', error);
      toast.error('Error publishing bookmark');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookmarks?.content) convertMarkdownToBlocks(bookmarks.content);
  }, [bookmarks, convertMarkdownToBlocks]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-12 w-4/4 mb-6" />
        <div className="flex items-center space-x-4 mb-6">
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-64 w-full mb-6" />
        <Skeleton className="h-6 w-full mb-4" />
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={index} className="h-6 w-full mb-4" />
        ))}
        <Skeleton className="h-6 w-3/4 mb-4" />
        <Skeleton className="h-6 w-2/3 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-4" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center">
        <Image src="/404.png" alt="404" width={400} height={400} />
        <p className="text-red-500 mt-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center xs:pl-18">
      <article className="max-w-full py-4 sm:px-32 px-12">
        <ToastContainer />

        {bookmarks && (
          <div>
            <header className="mb-4 sm:mb-8">
              <h1 className="text-2xl sm:text-4xl font-extrabold mb-2 px-4">{bookmarks.title}</h1>
            </header>

            {bookmarks.cover_image_url && (
              <div className="mb-6 sm:mb-8 aspect-video relative overflow-hidden rounded-lg">
                <Image
                  src={bookmarks.cover_image_url}
                  alt={bookmarks.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-105"
                />
              </div>
            )}

                <BlockNoteView
                editor={editor}
                editable={false}
                autoFocus={false}
                theme={{ colors: { editor: { background: 'rgba(255, 255, 255, 0)', text: "#757575" } } }}
                className="mt-10 sm:m-6 bg-transparent text-balance text-xs sm:text-base"
                />

          </div>
        )}
      </article>
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => router.back()} >Go Back</Button>
        <Button variant="outline" size="sm" onClick={() => handlePublish(bookmarks?.id || '')}>Publish</Button>
      </div>
    </div>
  );
}
