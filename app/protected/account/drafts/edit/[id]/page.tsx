
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

interface Drafts {
  likes: number;
  id: string;
  title: string;
  content: string;
  created_at: string;
  read_time: number;
  profiles: Profile | null;
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
  const draftId = Array.isArray(id) ? id[0] : id;
  const [drafts, setDrafts] = useState<Drafts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);




  
  const editor = useCreateBlockNote();

  const fetchDrafts = async () => {
    if (!draftId || !isValidUuid(draftId)) {
      setError(draftId ? "Invalid Draft ID format" : "Post ID is undefined");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data: draftsData, error: draftsError } = await supabase
        .from("drafts")
        .select(`
          *,
          profiles(username, avatar_url, id)
        `)
        .eq("id", draftId)
        .single();

      if (draftsError) {
        setError(draftsError.code === 'PGRST116' ? "Post not found" : draftsError.message);
        return;
      }

      setDrafts(draftsData as Drafts);
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
    if (draftId && isValidUuid(draftId)) fetchDrafts();
  }, [draftId]);

  const handlePublish = async (id: string) => {
    setLoading(true);

    try {
      const { data: draft, error: fetchError } = await supabase
        .from('drafts')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !draft) throw new Error(fetchError?.message || 'Draft not found');

      const { error: insertError } = await supabase
        .from('posts')
        .insert([{
          id: draft.id,
          title: draft.title,
          content: draft.content,
          user_id: draft.user_id,
          cover_image_url: draft.cover_image_url,
        }]);

      if (insertError){
         throw new Error(insertError.message);
      }else{
        toast.success('Post published sucessfully')
     }


      const { error: deleteError } = await supabase
        .from('drafts')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('Error deleting draft:', deleteError.message);
        toast.error('Draft published, but failed to delete the draft');
      } else {
        setDrafts((prevDrafts) => prevDrafts?.id !== id ? prevDrafts : null);
      }

      toast.success('Post published successfully!');
    } catch (error) {
      console.error('Error publishing draft:', error);
      toast.error('Error publishing draft');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (drafts?.content) convertMarkdownToBlocks(drafts.content);
  }, [drafts, convertMarkdownToBlocks]);

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

        {drafts && (
          <div>
            <header className="mb-4 sm:mb-8">
              <h1 className="text-2xl sm:text-4xl font-extrabold mb-2 px-4">{drafts.title}</h1>
            </header>

            {drafts.cover_image_url && (
              <div className="mb-6 sm:mb-8 aspect-video relative overflow-hidden rounded-lg">
                <Image
                  src={drafts.cover_image_url}
                  alt={drafts.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-105"
                />
              </div>
            )}

            <BlockNoteView
              editor={editor}
              editable={true}
              autoFocus={false}
              theme={{ colors: { editor: { background: 'rgba(255, 255, 255, 0)', text: "#757575" } } }}
              className="mt-10 sm:m-6 bg-transparent text-balance text-xs sm:text-base"
            />
          </div>
        )}
      </article>
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => router.back()} >Go Back</Button>
        <Button variant="outline" size="sm" onClick={() => handlePublish(drafts?.id || '')}>Publish</Button>
      </div>
    </div>
  );
}
