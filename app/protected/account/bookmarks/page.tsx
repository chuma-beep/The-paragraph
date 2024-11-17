// "use client"

// import { useEffect, useState } from 'react'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Bookmark, Clock, Filter } from "lucide-react"
// import { Badge } from "@/components/ui/badge"   
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { createClient } from '@/utils/supabase/client'
// import {toast, ToastContainer} from "react-toastify"

// interface BookmarkedPost {
//   id: number
//   title: string
//   content: string;
//   date: string;
// }

// export default function Component() {
//   const supabase = createClient()
//   const [bookmarks, setBookmarks ] = useState<BookmarkedPost[]>([])
//   const [loading, setLoading] = useState<boolean>(true);
//   const [truncatedContents, setTruncatedContents] = useState<Record<string, string>>({});
//   // const supabase = createClientComponentClient();

 
//   useEffect(() => {
//     const bookmarkedPosts = async () => {
//       // const user = supabase.auth.getUser();
//       // if(!user?.id){
//       //}


//       const {data, error} = await supabase
//        .from('bookmarks')
//        .select('*')
       
//        if(error) {
//         console.error('Error fetching Bookmarks', error);
//         toast.error("Error fecthing bookmarks")
//        }else{
//         setBookmarks(data)
//        }
    
//        setLoading(false)
//       };
//   }, [supabase])

//   // const removeBookmark = (id: number) => {
//   //   setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id))
//   // }

//   // function toggleReadLater(id: number): void {
//   //   throw new Error('Function not implemented.')
//   // }

//   return (
//     <Card className="w-full max-w-4xl mx-auto">
//       <CardHeader>
//         <div className="flex justify-between items-center">
//           <div>
//             <CardTitle className="text-2xl">My Bookmarked Posts</CardTitle>
//             <CardDescription>Your saved articles for later reading</CardDescription>
//           </div>
//           {/* <Select onValueChange={setFilter} defaultValue="all">
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Filter bookmarks" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Bookmarks</SelectItem>
//               <SelectItem value="readLater">Read Later</SelectItem>
//             </SelectContent>
//           </Select> */}
//         </div>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {bookmarks.map((bookmark) => (
//             <Card key={bookmark.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4">
//               <div className="flex-1 min-w-0">
//                 <h3 className="text-lg font-semibold truncate">{bookmark.title}</h3>
//                 <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{bookmark.content}</p>
//                 <div className="flex items-center mt-2 space-x-2">
//                   <Badge variant="secondary">{bookmark.date}</Badge>
//                   {/* {bookmark.readLater && <Badge variant="outline">Read Later</Badge>} */}
//                 </div>
//               </div>
//               <div className="flex items-center mt-3 sm:mt-0 sm:ml-4 space-x-2">
//                 <Button variant="outline" size="sm" onClick={() => toggleReadLater(bookmark.id)}>
//                   {/* {bookmark.readLater ? <Bookmark className="h-4 w-4 mr-1" /> : <Clock className="h-4 w-4 mr-1" />} */}
//                   {/* {bookmark.readLater ? 'Bookmarked' : 'Read Later'} */}
//                 </Button>
//                 <Button variant="ghost" size="sm" onClick={() => removeBookmark(bookmark.id)}>
//                   Remove
//                 </Button>
//               </div>
//             </Card>
//           ))}
//           <ToastContainer/>
//         </div>
//       </CardContent>
  
//     </Card>
//   )
// }




'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { marked } from "marked";
import DOMPurify from 'dompurify';
import { createClient } from '@/utils/supabase/client';
import { toast, ToastContainer } from 'react-toastify';

interface BookmarkedPost {
  id: number;
  title: string;
  content: string;
  date: string;
}

export default function Component() {
  const supabase = createClient();
  const [bookmarks, setBookmarks] = useState<BookmarkedPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [truncatedContents, setTruncatedContents] = useState<Record<string, string>>({});

  // Fetch bookmarks when the component loads
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
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching bookmarks:', error.message);
        toast.error('Error fetching bookmarks.');
      } else {
        setBookmarks(data || []);
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


  
  useEffect(() => {
    const processContents = async () => {
      const newTruncatedContents: Record<string, string> = {};

      await Promise.all(
        bookmarks.map(async (draft) => {
          const htmlContent = await marked(draft.content || "");
          const sanitizedHtmlContent = DOMPurify.sanitize(htmlContent);
          const plainTextContent = sanitizedHtmlContent.replace(/<[^>]*>?/gm, '');
          newTruncatedContents[draft.id] = plainTextContent.substring(0, 100) + '...';
        })
      );

      setTruncatedContents(newTruncatedContents);
    };

    if (bookmarks.length) {
      processContents();
    }
  }, [bookmarks]);




  if (loading) {
    return(
    <div className="w-full max-w-4xl mx-auto py-8 px-4 md:px-6">
    <SkeletonLoader />
  </div>  
    )  
}

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
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
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4"
              >
                <div className="flex-1 min-w-0">
                  {/* <h3 className="text-lg font-semibold truncate">{bookmark.title}</h3> */}
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {/* {bookmark.content} */}
                    {truncatedContents[bookmark.id]}
                  </p>
                  <div className="flex items-center mt-2 space-x-2">
                    <Badge variant="secondary">{bookmark.date}</Badge>
                  </div>
                </div>
                <div className="flex items-center mt-3 sm:mt-0 sm:ml-4 space-x-2">
                  {/* <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleReadLater(bookmark.id)}
                  >
                    Read Later
                  </Button> */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBookmark(bookmark.id)}
                  >
                    Remove
                  </Button>
                </div>
              </Card>
            ))
          )}
          <ToastContainer />
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
