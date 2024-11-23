"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface Profile {
  username: string;
  avatar_url: string;
}

interface BookmarkPost {
  title: string;
  cover_image_url: string;
  content: string;
  created_at: string;
  profiles: Profile;
}

interface Bookmarks {
  id: string;
  posts: BookmarkPost;
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
        setError(bookmarksError.code === "PGRST116" ? "Post not found" : bookmarksError.message);
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

  const removeBookmark = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      toast.error("You must log in to remove a bookmark.");
      return;
    }

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", bookmarkId)
      .eq("user_id", userData.user.id);

    if (error) {
      console.error("Error removing bookmark:", error.message);
      toast.error("Failed to remove bookmark.");
    } else {
      setBookmarks(null); // Clear the state on successful deletion
      toast.success("Bookmark removed.");
      router.back(); // Redirect back after deletion
    }
  };

  useEffect(() => {
    if (bookmarks?.posts?.content) convertMarkdownToBlocks(bookmarks.posts.content);
  }, [bookmarks, convertMarkdownToBlocks]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-12 w-4/4 mb-6" />
        <Skeleton className="h-64 w-full mb-6" />
        <Skeleton className="h-6 w-full mb-4" />
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={index} className="h-6 w-full mb-4" />
        ))}
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
              <h1 className="text-2xl sm:text-4xl font-extrabold mb-2 px-4">{bookmarks.posts.title}</h1>
            </header>

            {bookmarks.posts.cover_image_url && (
              <div className="mb-6 sm:mb-8 aspect-video relative overflow-hidden rounded-lg">
                <Image
                  src={bookmarks.posts.cover_image_url}
                  alt={bookmarks.posts.title}
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
              theme={{
                colors: { editor: { background: "rgba(255, 255, 255, 0)", text: "#757575" } },
              }}
              className="mt-10 sm:m-6 bg-transparent text-balance text-xs sm:text-base"
            />
          </div>
        )}
      </article>
      <div className="flex justify-end gap-4 p-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          Go Back
        </Button>
        <Button variant="destructive" size="sm" onClick={removeBookmark}>
          Remove
        </Button>
      </div>
    </div>
  );
}
