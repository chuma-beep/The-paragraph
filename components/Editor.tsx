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
import { X } from 'lucide-react'
import debounce from 'debounce';


import { Post } from '@/types/types'; // Adjust the import path as necessary


const supabase = createClient();

const MAX_TAGS = 4; 

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


interface Tag{
  id: string;
  name: string;
}


interface HandleAddTagOptions {
  tag: string;  
  postId?: string;
  draftId?: string;
}



interface EditorProps {
  initialContent: string;
  postId?: string;
  id: string;
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
  const [tags, setTags] = useState<string[]>([]);

  const editor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    uploadFile: uploadFile,
  });


  const handleEditorChange = debounce(async () => {

    const markdownContent = await editor.blocksToMarkdownLossy(editor.document);
    setMarkdown(markdownContent);
    //save to local storage
    localStorage.setItem('blocknoteContent', markdownContent);
   if (onChangeProp){
    onChangeProp(markdownContent);
   }
  }, 1000);


  useEffect(() => {

  const loadContent = async () => {
  const savedContent = localStorage.getItem('blocknoteContent');
    if (savedContent) {
       const parsedBlocks = await editor.tryParseMarkdownToBlocks(savedContent);
       if (parsedBlocks){
        editor.replaceBlocks(editor.document, parsedBlocks)
       }
    }
  };
  loadContent();
       
    const interval = setInterval (() => {
        handleEditorChange();
    }, 1000)

    return () => {
      clearInterval(interval)
    };

  }, [editor]);



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

  const handleAddTag = async (tag: string, postId: string) => {
    // Check tags limit
    if (tags.length >= MAX_TAGS) {
      toast.error(`You can only add up to ${MAX_TAGS} tags`);
      return;
    }
  
    const normalizedTag = tag.trim().toLowerCase();
  
  //  if(tags.includes(normalizedTag)){  
  //   toast.error('Tag already added');  
  //   return; 
  //   }


    // Check for existing tag
    const { data: existingTag, error: getTagError } = await supabase
      .from('tags')
      .select('*, id')
      .eq('name', normalizedTag)
      .maybeSingle<Tag>();
  
    if (getTagError) {
      console.error('Error fetching tag:', getTagError);
      return;
    }
  
    let tagId: string;
  
    if (existingTag) {
      // If tag exists, get its ID
      tagId = existingTag.id;
    } else {
      // If tag doesn't exist, insert a new tag
      const { data: newTag, error: insertTagError } = await supabase
        .from('tags')
        .insert([{ name: normalizedTag }])
        .single<Tag>();
  
      if (insertTagError) {
        console.error('Error inserting tag:', insertTagError.message);
        return;
      }
  
      if (!newTag) {
        console.error('New tag is null');
        return;
      }
  
      // Assign the new tag's ID
      tagId = newTag.id;    
      
    }
  
    // Insert into post_tags if postId is provided
    if (postId) {
      const { error: insertPostTagError } = await supabase
        .from('post_tags')
        .insert([{ post_id: postId, tag_id: tagId }]);
  
      if (insertPostTagError) {
        console.error('Error associating tag with post:', insertPostTagError.message);
        return;
      }
    }
  
    // Update the tags state if it's not already present
    setTags((prevTags) => {
      if (!prevTags.includes(normalizedTag)) {
        return [...prevTags, normalizedTag];
      }
      return prevTags;
    });
  };




 const handleRemoveTags = (tagToRemove: string) => {
  setTags(tags.filter((tag) => tag !== tagToRemove));
 }




const sendPost = async () => {
    if (!ensureAuthenticated()) return;
    setLoading(true);
  
    const { data, error} = await supabase
      .from('posts')
      .insert([{ title, content: markdown, cover_image_url: coverImageUrl, user_id: userId }])
      .select();
  
    if (!error) {
      const postId = data[0].id;
      toast.success('Post saved successfully!');
      // Insert tags
      for (const tag of tags) {
          await handleAddTag(tag, postId);
      }

      
      if(title === " " ){
        toast.error('Title is required');
        return(setLoading(false));
        }

      // Clear local storage
      localStorage.removeItem('blocknoteContent');
  
      // Reset the editor to a blank document
      editor.replaceBlocks(editor.document, []);
  
      // Clear other fields like title, tags, etc.
      setTitle('');
      setTags([]);
      setCoverImageUrl(null);
    }
      else {
      console.error('Error saving post:', error, error.details);
         toast.error('Please fill in all required fields');
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
  
    if (!error) {
      const draftId = data[0].id;
      toast.success('Draft saved successfully!');
      // Insert tags
      for (const tag of tags) {
        await handleAddTag(tag, draftId);
      }
  
      // Clear local storage
      localStorage.removeItem('blocknoteContent');
      // Reset the editor to a blank document
      editor.replaceBlocks(editor.document, []);
  
      // Clear other fields
      setTitle('');
      setTags([]);
      setCoverImageUrl(null);
    } else{
      console.error('Error saving draft:', error, error.details);
      toast.error('Error saving draft');
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


      if (!error) {
        // const postId = data[0].id;
        toast.success('Post updated successfully!');
        for (const tag of tags) {
      //  await handleAddTag(tag,  postId);
        }
    

      //clear local storage
      localStorage.removeItem('blocknoteContent');
      editor.replaceBlocks(editor.document, []);
      setTitle('');
      setTags([]);
      setCoverImageUrl(null);
      }


    
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



      if (!error) {
        // const draftId = data[0].id;
        // Insert tags
        for (const tag of tags) {
        // await handleAddTag(tag, draftId);
        }
      }

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
      .select('title, content, post_tags(tag_id, tags(name))')
      .eq('id', id)
      .single();

    if (data) {
      setTitle(data.title);
      editor.blocksToMarkdownLossy(data.content);

    const fetchedTags = data.post_tags.map((postTag: any) => postTag.tags.name);
    setTags(fetchedTags);
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
          <div className="m-0">
          <BlockNoteView
             editor={editor}
             onChange={onChange}
              theme={localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'}
              className="-m-8 sm:m-0 bg-transparent text-balance text-xs sm:text-base"
                           />
           </div>

          <div className="w-full max-w-xs ml-0 mt-6">
          <input
  type="text"
  placeholder="add tags"
  className="mb-2 mt-10 bg-transparent border-none outline-none"
  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      handleAddTag(e.currentTarget.value.trim(), postId || draftId || '');
      e.currentTarget.value = '';
    }
  }}
/>
 
        <div className="flex flex-wrap gap-2">
  {tags.map((tag, index) => (
    <span
      key={index}
      className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md text-sm relative group hover:border-blue-400 hover:border transition-colors"
    >
      {tag}
      <button
        onClick={() => handleRemoveTags(tag)}
        className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X />
      </button>
    </span>
  ))}
</div>
    </div>
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




