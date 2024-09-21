// 'use client';

// import { useEffect, useState } from 'react';
// import { createClient as createClientComponentClient } from '@/utils/supabase/client';
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
// import { marked } from "marked";
// import DOMPurify from 'dompurify';
// import { toast, ToastContainer } from 'react-toastify';

// // Define the type for the draft objects
// type Draft = {
//   id: string;
//   title: string | null;
//   content: string | null;
//   updated_at: string | null;
//   user_id: string | null;
//   cover_image_url: string | null;
// };

// export default function Drafts() {
//   const [drafts, setDrafts] = useState<Draft[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const supabase = createClientComponentClient();

//   useEffect(() => {
//     const fetchDrafts = async () => {
//       const { data, error } = await supabase
//         .from('drafts')
//         .select('id, title, content, updated_at, user_id, cover_image_url');

//       if (error) {
//         console.error('Error fetching drafts:', error);
//       } else {
//         setDrafts(data);
//       }

//       setLoading(false);
//     };

//     fetchDrafts();
//   }, [supabase]);

//   const handleDelete = async (id: string) => {
//     const { error } = await supabase
//       .from('drafts')
//       .delete()
//       .match({ id });

//     if (error) {
//       console.error('Error deleting draft:', error);
//     } else {
//       setDrafts(drafts.filter(draft => draft.id !== id));
//     }
//   };

//   const handlePublish = async (id: string) => {
//     setLoading(true);
  
//     try {
//       // Fetch the draft to be published
//       const { data: draft, error: fetchError } = await supabase
//         .from('drafts')
//         .select('id, title, content, updated_at, user_id, cover_image_url')
//         .eq('id', id)
//         .single();
  
//       if (fetchError || !draft) {
//         throw new Error(fetchError?.message || 'Draft not found');
//       }
  
//       // Insert the draft into the posts table
//       const { data: post, error: insertError } = await supabase
//         .from('posts')
//         .insert([{
//           id: draft.id, // Or generate a new ID if necessary
//           title: draft.title,
//           content: draft.content,
//           user_id: draft.user_id,
//           cover_image_url: draft.cover_image_url,
//         }])
//         .select();
  
//       if (insertError) {
//         throw new Error(insertError.message);
//       }
  
//       // Optionally delete the draft after publishing
//       const { error: deleteError } = await supabase
//         .from('drafts')
//         .delete()
//         .eq('id', id);
  
//       if (deleteError) {
//         console.error('Error deleting draft:', deleteError.message);
//         toast.error('Draft published, but failed to delete the draft.');
//       } else {
//         // Remove the published draft from state
//         setDrafts(drafts.filter(draft => draft.id !== id));
//       }
  
//       toast.success('Post published successfully!');
//     } catch (error) {
//       console.error('Error publishing draft:', error);
//       toast.error('Error publishing draft');
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   if (loading) {
//     return (
//       <div className="w-full max-w-4xl mx-auto py-8 px-4 md:px-6">
//         <SkeletonLoader />
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-4xl mx-auto py-8 px-4 md:px-6">
//       <ToastContainer/>
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold">Drafts</h1>
//         <Button size="sm">Add New</Button>
//       </div>
//       <div className="grid gap-4">
//         {drafts.map((draft) => {
//           const [truncatedContent, setTruncatedContent] = useState<string>('');

//           useEffect(() => {
//               const processedContent = async () => {
//                 try {
//                   const htmlContent = await marked(draft.content || "");
//                   const sanitizedHtmlContent = DOMPurify.sanitize(htmlContent);
//                   const plainTextContent = sanitizedHtmlContent.replace(/<[^>]*>?/gm, '');
//                   const truncatedContent = plainTextContent.substring(0, 100) + '...';
//                   setTruncatedContent(truncatedContent);
//                 } catch (error) {
//                   console.error('Error processing content:', error);
//                 }
//               }
//               processedContent();
//           })

//           return (
//             <Card
//               key={draft.id}
//               className="transition-transform transform hover:scale-105 hover:shadow-lg"
//             >
//               {draft.cover_image_url && (
//                 <div className="relative h-48">
//                   <img
//                     src={draft.cover_image_url}
//                     alt={draft.title || "Cover Image"}
//                     className="object-cover w-full h-full"
//                   />
//                 </div>
//               )}
//               <CardHeader>
//                 <div className="flex items-center justify-between">
//                   <div className='flex flex-row flex-wrap gap-10'>
//                     <h3 className="text-lg font-semibold">{draft.title || "Untitled"}</h3>
//                     <p className="text-muted-foreground text-sm">Last updated {draft.updated_at || "N/A"}</p>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-muted-foreground line-clamp-2">
//                   {truncatedContent}
//                 </p>
//               </CardContent>
//               <CardFooter className="flex justify-end gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="transition-colors hover:bg-gray-200"
//                 >
//                   Edit
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="transition-colors hover:bg-green-200"
//                   onClick={() => handlePublish(draft.id)}
//                 >
//                   Publish
//                 </Button>
//                 <Button
//                   variant="destructive"
//                   size="sm"
//                   className="transition-colors hover:bg-red-200"
//                   onClick={() => handleDelete(draft.id)}
//                 >
//                   Delete
//                 </Button>
//               </CardFooter>
//             </Card>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// // SkeletonLoader component for loading state
// const SkeletonLoader = () => (
//   <div className="space-y-4">
//     {[...Array(3)].map((_, index) => (
//       <div key={index} className="p-4 border border-gray-200 rounded-md shadow-sm animate-pulse">
//         <div className="h-48 bg-gray-300 rounded-md mb-4"></div>
//         <div className="space-y-2">
//           <div className="h-6 bg-gray-300 rounded w-3/4"></div>
//           <div className="h-4 bg-gray-300 rounded w-1/2"></div>
//         </div>
//       </div>
//     ))}
//   </div>
// );



'use client';

import { useEffect, useState } from 'react';
import { createClient as createClientComponentClient } from '@/utils/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { marked } from "marked";
import DOMPurify from 'dompurify';
import { toast, ToastContainer } from 'react-toastify';

// Define the type for the draft objects
type Draft = {
  id: string;
  title: string | null;
  content: string | null;
  updated_at: string | null;
  user_id: string | null;
  cover_image_url: string | null;
};

export default function Drafts() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [truncatedContents, setTruncatedContents] = useState<Record<string, string>>({});
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchDrafts = async () => {
      const { data, error } = await supabase
        .from('drafts')
        .select('id, title, content, updated_at, user_id, cover_image_url');

      if (error) {
        console.error('Error fetching drafts:', error);
      } else {
        setDrafts(data);
      }

      setLoading(false);
    };

    fetchDrafts();
  }, [supabase]);

  useEffect(() => {
    const processContents = async () => {
      const newTruncatedContents: Record<string, string> = {};

      await Promise.all(
        drafts.map(async (draft) => {
          const htmlContent = await marked(draft.content || "");
          const sanitizedHtmlContent = DOMPurify.sanitize(htmlContent);
          const plainTextContent = sanitizedHtmlContent.replace(/<[^>]*>?/gm, '');
          newTruncatedContents[draft.id] = plainTextContent.substring(0, 100) + '...';
        })
      );

      setTruncatedContents(newTruncatedContents);
    };

    if (drafts.length) {
      processContents();
    }
  }, [drafts]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('drafts')
      .delete()
      .match({ id });

    if (error) {
      console.error('Error deleting draft:', error);
    } else {
      setDrafts(drafts.filter(draft => draft.id !== id));
    }
  };

  const handlePublish = async (id: string) => {
    setLoading(true);

    try {
      const { data: draft, error: fetchError } = await supabase
        .from('drafts')
        .select('id, title, content, updated_at, user_id, cover_image_url')
        .eq('id', id)
        .single();

      if (fetchError || !draft) {
        throw new Error(fetchError?.message || 'Draft not found');
      }

      const { error: insertError } = await supabase
        .from('posts')
        .insert([{
          id: draft.id,
          title: draft.title,
          content: draft.content,
          user_id: draft.user_id,
          cover_image_url: draft.cover_image_url,
        }]);

      if (insertError) {
        throw new Error(insertError.message);
      }

      const { error: deleteError } = await supabase
        .from('drafts')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('Error deleting draft:', deleteError.message);
        toast.error('Draft published, but failed to delete the draft.');
      } else {
        setDrafts(drafts.filter(draft => draft.id !== id));
      }

      toast.success('Post published successfully!');
    } catch (error) {
      console.error('Error publishing draft:', error);
      toast.error('Error publishing draft');
    } finally {
      setLoading(false);
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
    <div className="w-full max-w-4xl mx-auto py-8 px-4 md:px-6">
      <ToastContainer />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Drafts</h1>
        <Button size="sm">Add New</Button>
      </div>
      <div className="grid gap-4">
        {drafts.map((draft) => (
          <Card
            key={draft.id}
            className="transition-transform transform hover:scale-105 hover:shadow-lg"
          >
            {draft.cover_image_url && (
              <div className="relative h-48">
                <img
                  src={draft.cover_image_url}
                  alt={draft.title || "Cover Image"}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex flex-row flex-wrap gap-10">
                  <h3 className="text-lg font-semibold">{draft.title || "Untitled"}</h3>
                  <p className="text-muted-foreground text-sm">Last updated {draft.updated_at || "N/A"}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground line-clamp-2">
                {truncatedContents[draft.id]}
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" size="sm">Edit</Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePublish(draft.id)}
              >
                Publish
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(draft.id)}
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
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
