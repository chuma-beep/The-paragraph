'use client'

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'react-toastify';
import TextareaAutosize from 'react-textarea-autosize';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import { FcAddImage } from "react-icons/fc";
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';
import { PartialBlock } from '@blocknote/core';

const supabase = createClient();

async function uploadFile(file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { data, error } = await supabase.storage
    .from('post-image')
    .upload(filePath, file);

  if (error) {
    console.error('Error uploading file:', error);
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from('post-image')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

interface EditorProps {
  initialContent: string;
  postId?: string;
  draftId?: string;
  editable?: boolean;
  onChange?: (markdown: string) => void;
}

const Editor: React.FC<EditorProps> = ({
  initialContent,
  postId,
  draftId,
  editable = true,
  onChange: onChangeProp
}) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [markdown, setMarkdown] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const editor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    uploadFile: uploadFile,
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
        toast.error('Error authenticating user');
        setUserId(null);
      } else if (user) {
        setUserId(user.id);
      } else {
        setUserId(null);
      }
    };
    fetchUser();
  }, []);

  async function handleCoverImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `covers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('cover-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
      } else {
        const { data: publicUrlData } = supabase.storage
          .from('cover-images')
          .getPublicUrl(filePath);
        setCoverImageUrl(publicUrlData.publicUrl);
      }
    }
  }

  const ensureAuthenticated = () => {
    if (!userId) {
      toast.error('User not authenticated. Please log in.');
      return false;
    }
    return true;
  };

  const sendPost = async () => {
    if (!ensureAuthenticated()) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .insert([{ title, content: markdown, cover_image_url: coverImageUrl, user_id: userId }])
      .select();

    if (error) {
      console.error('Error saving post:', error, error.details);
      toast.error('Error saving post');
    } else {
      console.log('Post saved:', data);
      toast.success('Post saved successfully!');
    }
    setLoading(false);
  };

  const saveDraft = async () => {
    if (!ensureAuthenticated()) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('drafts')
      .insert([{ title, content: markdown, isdraft: true, cover_image_url: coverImageUrl, user_id: userId }])
      .select();

    if (error) {
      console.error('Error saving draft:', error, error.details);
      toast.error('Error saving draft');
    } else {
      console.log('Draft saved:', data);
      toast.success('Draft saved successfully!');
    }
    setLoading(false);
  };

  const updatePost = async () => {
    if (!ensureAuthenticated()) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .update({ title, content: markdown, cover_image_url: coverImageUrl, user_id: userId })
      .eq('id', postId);

    if (error) {
      console.error('Error updating post:', error);
      toast.error('Error updating post');
    } else {
      console.log('Post updated:', data);
      toast.success('Post updated successfully!');
    }
    setLoading(false);
  };

  const updateDraft = async () => {
    if (!ensureAuthenticated()) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('drafts')
      .update({ title, content: markdown, cover_image_url: coverImageUrl, user_id: userId })
      .eq('id', draftId);

    if (error) {
      console.log('Error updating draft:', error);
      toast.error('Error updating draft');
    } else {
      console.log('Draft updated:', data);
      toast.success('Draft updated successfully!');
    }
    setLoading(false);
  };

  const fetchPostOrDraft = async () => {
    setLoading(true);
    const table = postId ? 'posts' : 'drafts';
    const id = postId || draftId;

    const { data, error } = await supabase
      .from(table)
      .select('title, content')
      .eq('id', id)
      .single();

    if (data) {
      setTitle(data.title);
      editor.blocksToMarkdownLossy(data.content);
    } else {
      console.error(`Error fetching ${table}:`, error);
      toast.error(`Error fetching ${table}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (postId || draftId) {
      fetchPostOrDraft();
    }
  }, [postId, draftId]);

  const handleSavePost = () => {
    if (postId) {
      updatePost();
    } else {
      sendPost();
    }
  };

  const handleSaveDraft = () => {
    if (draftId) {
      updateDraft();
    } else {
      saveDraft();
    }
  };

  const onChange = async () => {
    const markdown = await editor.blocksToMarkdownLossy(editor.document);
    setMarkdown(markdown);
    if (onChangeProp) {
      onChangeProp(markdown);
    }
  };

  useEffect(() => {
    onChange();
  }, [editor]);

  return (
    <>
      <div>
        <div className='-mx-[54px] my-4'>
          <div className="mb-4 relative group">
            {coverImageUrl ? (
              <>
                <Image src={coverImageUrl} alt="Cover" width={800} height={400} layout="responsive" />
                <label
                  htmlFor="cover-image-upload"
                  className="cursor-pointer absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <div className="flex space-x-2 bg-blue-500 text-white px-2 py-2 rounded-md hover:bg-blue-600 transition duration-300">
                    <FcAddImage className="w-5 h-5" />
                    <span>Cover Image</span>
                  </div>
                </label>
              </>
            ) : (
              <label
                htmlFor="cover-image-upload"
                className="cursor-pointer flex items-center justify-center w-36 h-12 border-gray-300 rounded-md hover:bg-gray-200 transition duration-300"
              >
                <div className="flex gap-2 justify-center items-center space-y-2">
                  <FcAddImage className="w-6 h-6 text-gray-400" />
                  <span className="text-gray-500 text-sm pb-2">Cover Image</span>
                </div>
              </label>
            )}
            <input
              id="cover-image-upload"
              type="file"
              accept="image/*"
              onChange={handleCoverImageUpload}
              className="hidden"
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <TextareaAutosize
              placeholder="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-5xl resize-none appearance-none overflow-hidden bg-transparent hover:border-none focus:border-none focus:outline-none"
            />
          </div>
          <BlockNoteView
            editor={editor}
            editable={editable}
            theme="light"
            onChange={onChange}
            className='h-full'
          />
          <div className='flex justify-end mt-4'>
            <button
              onClick={handleSavePost}
              className={`ml-2 p-2 ${loading || !userId ? 'bg-gray-400' : 'bg-blue-500'} text-white rounded`}
              disabled={loading || !userId}
            >
              {loading ? 'Saving...' : postId ? 'Update Post' : 'Send to Post'}
            </button>
            <button
              onClick={handleSaveDraft}
              className={`ml-2 p-2 ${loading || !userId ? 'bg-gray-400' : 'bg-yellow-500'} text-white rounded`}
              disabled={loading || !userId}
            >
              {loading ? 'Saving Draft...' : draftId ? 'Update Draft' : 'Save to Draft'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Editor;