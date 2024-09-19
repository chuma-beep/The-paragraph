// "use client";

// import React, { useEffect, useState, useRef, useCallback } from "react";
// import Link from "next/link";
// import { createClient } from "@/utils/supabase/client";
// import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
// import { Book, Heart, MessageCircle } from "lucide-react";
// import Image from "next/image";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
// import {UserAvatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { marked } from "marked";
// import DOMPurify from 'dompurify';
// import { Database as DB } from '@/lib/database.types';



// //import AvatarPic from "@/components/AvatarImage/AvatarImage";
// import Likes from '../likes';
// import BookmarkButton from "@/components/BookmarkButton";

// interface Post {
//   id: string;
//   title: string;
//   content: string;
//   created_at: string;
//   likes: number;
//   cover_image_url?: string | null;
//   profiles?: {
//     id: string;
//     username: string;
//     avatar_url: string | null;
//   };
// }

// export default function PostList() {
//   const supabase = createClient();
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [comments, setComments] = useState<Record<string, any>>({});
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const observer = useRef<IntersectionObserver | null>(null);


//   const fetchPosts = useCallback(async () => {
//     if (!hasMore) return; // Avoid fetching if no more posts are available

//     try {
//       setLoading(true);
//       const { data: postsData, error: postsError } = await supabase
//         .from("posts")
//         .select(
//           `
//           *,
//           profiles (
//             id,
//             username,
//             avatar_url
//           )
//         `
//         )
//         .order("created_at", { ascending: false })
//         .range((page - 1) * 5, page * 5 - 1);

//       if (postsError) throw postsError;

//       if (postsData.length === 0) {
//         setHasMore(false);
//       } else {
//         // Only update posts if new posts are fetched
//         setPosts((prevPosts) => {
//           const newPosts = postsData.filter(
//             (post) => !prevPosts.some((p) => p.id === post.id)
//           );
//           return [...prevPosts, ...newPosts];
//         });

//         // Fetch comments for each post
//         const commentsData: Record<string, any> = {};
//         for (const post of postsData) {
//           const { data: postComments, error: commentsError } = await supabase
//             .from("comments")
//             .select("*")
//             .eq("post_id", post.id);

//           if (commentsError) {
//             console.error(`Error fetching comments for post ${post.id}:`, commentsError);
//           } else {
//             commentsData[post.id] = postComments || [];
//           }
//         }
//         setComments((prevComments) => ({ ...prevComments, ...commentsData }));
//       }
//     } catch (error) {
//       if ((error as Error).message.includes("Requested range not satisfiable")) {
//         setHasMore(false);
//       } else {
//         setError((error as Error).message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [page, hasMore, supabase]);

//   useEffect(() => {
//     fetchPosts();
//   }, [fetchPosts]);

//   const lastPostElementRef = useCallback(
//     (node: HTMLElement | null) => {
//       if (loading) return;
//       if (observer.current) observer.current.disconnect();

//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && hasMore) {
//           setPage((prevPage) => prevPage + 1);
//         }
//       });

//       if (node) observer.current.observe(node);
//     },
//     [loading, hasMore]
//   );

//   const renderPostCard = (post: Post, index: number) => {
//     const isLastElement = posts.length === index + 1;
//     const author = post.profiles || { username: "Unknown", avatar_url: null };
//     const htmlContent = marked(post.content);
//     const sanitizedHtmlContent = DOMPurify.sanitize(htmlContent);
//     const plainTextContent = sanitizedHtmlContent.replace(/<[^>]*>?/gm, '');
//     const truncatedContent = plainTextContent.substring(0, 100)+ '...';

//     return (
//       <Link href={`/post/${post.id}`} key={`${post.id}-${index}`} passHref>
//         <Card
//           ref={isLastElement ? lastPostElementRef : null}
//           className="w-full min-w-[20vw] max-w-[80vw]  transition-transform duration-200 ease-in-out transform hover:scale-105 cursor-pointer"
//         >
//           <CardHeader className="p-0">
//             <Image
//               src={post.cover_image_url || "/placeholder.svg"}
//               alt={post.title}
//               width={400}
//               height={200}
//               className="w-full h-48 object-cover rounded-t-lg"
//             />
//           </CardHeader>
//           <CardContent className="p-4">
//             <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors duration-200">
//               {post.title}
//             </h3>
//             <p className="text-muted-foreground">{truncatedContent}...</p>
//           </CardContent>
//           <CardFooter className="p-4 flex justify-between items-center">
//             <div className="flex items-center space-x-4">
//               <span className="flex items-center text-muted-foreground">
//                 <Heart className="w-4 h-4 mr-1" />
//                 {post.likes || 0}
//               </span>
//               <span className="flex items-center text-muted-foreground">
//                 <MessageCircle className="w-4 h-4 mr-1" />
//                 {comments[post.id]?.length || 0}
//               </span>
//               <BookmarkButton postId={""} isBookmarked={false}  />
//             </div>
//             <div className="flex items-center space-x-2">
//               <UserAvatar className="w-6 h-6">
//                 <AvatarImage src={author.avatar_url} alt={author.username} />
//                 <AvatarFallback>
//                   {author.username?.charAt(0).toUpperCase() || "U"}
//                 </AvatarFallback>
//               </UserAvatar>
//               <span className="text-sm text-muted-foreground">{author.username || "No UserName"}</span>
//             </div>
//           </CardFooter>
//         </Card>
//       </Link>
//     );
//   };

//   return (
//     <div className="container mx-auto p-4 flex flex-col items-center">
//       {posts.length === 0 && loading && (
//         <div className="flex flex-col items-center gap-6 max-w-screen-lg">
//           {Array.from({ length: 6 }).map((_, index) => (
//             <Card key={index} className="w-full min-w-[400px]">
//               <CardHeader className="p-0">
//                 <Skeleton height={200} width="100%" />
//               </CardHeader>
//               <CardContent className="p-4">
//                 <Skeleton height={30} width="80%" />
//                 <Skeleton height={20} width="100%" count={2} />
//               </CardContent>
//               <CardFooter className="p-4 flex justify-between items-center">
//                 <Skeleton width={50} />
//                 <Skeleton width={70} />
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//       )}

//       {error && !error.includes("Requested range not satisfiable") ? (
//         <p className="text-center text-red-500">Error: {error}</p>
//       ) : (
//         <div className="flex flex-col items-center gap-6 max-w-screen-lg">
//           {posts.map((post, index) => renderPostCard(post, index))}
//           {!hasMore && (
//             <div className="w-full text-center mt-4">
//               <p className="text-muted-foreground">You've reached the end.</p>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }








// "use client";

// import React, { useEffect, useState, useRef, useCallback } from "react";
// import Link from "next/link";
// import { createClient } from "@/utils/supabase/client";
// import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
// import { Book, Heart, MessageCircle } from "lucide-react";
// import Image from "next/image";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
// import { UserAvatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { marked } from "marked";
// import DOMPurify from "dompurify";
// import BookmarkButton from "@/components/BookmarkButton";

// interface Post {
//   id: string;
//   title: string;
//   content: string;
//   created_at: string;
//   likes: number;
//   cover_image_url?: string | null;
//   profiles?: {
//     id: string;
//     username: string;
//     avatar_url: string | null;
//   };
// }

// export default function PostList() {
//   const supabase = createClient();
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [comments, setComments] = useState<Record<string, any>>({});
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const observer = useRef<IntersectionObserver | null>(null);

//   const fetchPosts = useCallback(async () => {
//     if (!hasMore) return; // Avoid fetching if no more posts are available

//     try {
//       setLoading(true);
//       const { data: postsData, error: postsError } = await supabase
//         .from("posts")
//         .select(
//           `
//           *,
//           profiles (
//             id,
//             username,
//             avatar_url
//           )
//         `
//         )
//         .order("created_at", { ascending: false })
//         .range((page - 1) * 5, page * 5 - 1);

//       if (postsError) throw postsError;

//       if (postsData.length === 0) {
//         setHasMore(false);
//       } else {
//         // Only update posts if new posts are fetched
//         setPosts((prevPosts) => {
//           const newPosts = postsData.filter(
//             (post) => !prevPosts.some((p) => p.id === post.id)
//           );
//           return [...prevPosts, ...newPosts];
//         });

//         // Fetch comments for each post
//         const commentsData: Record<string, any> = {};
//         for (const post of postsData) {
//           const { data: postComments, error: commentsError } = await supabase
//             .from("comments")
//             .select("*")
//             .eq("post_id", post.id);

//           if (commentsError) {
//             console.error(`Error fetching comments for post ${post.id}:`, commentsError);
//           } else {
//             commentsData[post.id] = postComments || [];
//           }
//         }
//         setComments((prevComments) => ({ ...prevComments, ...commentsData }));
//       }
//     } catch (error) {
//       if ((error as Error).message.includes("Requested range not satisfiable")) {
//         setHasMore(false);
//       } else {
//         setError((error as Error).message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [page, hasMore, supabase]);

//   useEffect(() => {
//     fetchPosts();
//   }, [fetchPosts]);

//   const lastPostElementRef = useCallback(
//     (node: HTMLElement | null) => {
//       if (loading) return;
//       if (observer.current) observer.current.disconnect();

//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && hasMore) {
//           setPage((prevPage) => prevPage + 1);
//         }
//       });

//       if (node) observer.current.observe(node);
//     },
//     [loading, hasMore]
//   );

//   const handleToggleBookmark = async (postId: string) => {
//     // Implement the bookmark toggle logic here
//     console.log("Toggling bookmark for post:", postId);
//   };

//   const renderPostCard = (post: Post, index: number) => {
//     const isLastElement = posts.length === index + 1;
//     const author = post.profiles || { username: "Unknown", avatar_url: null };
//     const htmlContent = marked(post.content);
//     const sanitizedHtmlContent = DOMPurify.sanitize(htmlContent);
//     const plainTextContent = sanitizedHtmlContent.replace(/<[^>]*>?/gm, "");
//     const truncatedContent = plainTextContent.substring(0, 100) + "...";

//     return (
//       <Card
//         ref={isLastElement ? lastPostElementRef : null}
//         key={`${post.id}-${index}`}
//         className="w-full min-w-[20vw] max-w-[80vw] transition-transform duration-200 ease-in-out transform hover:scale-105"
//       >
//         <CardHeader className="p-0">
//           <Link href={`/post/${post.id}`} passHref>
//             <Image
//               src={post.cover_image_url || "/placeholder.svg"}
//               alt={post.title}
//               width={400}
//               height={200}
//               className="w-full h-48 object-cover rounded-t-lg cursor-pointer"
//             />
//           </Link>
//         </CardHeader>
//         <CardContent className="p-4">
//           <Link href={`/post/${post.id}`} passHref>
//             <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors duration-200 cursor-pointer">
//               {post.title}
//             </h3>
//           </Link>
//           <p className="text-muted-foreground">{truncatedContent}</p>
//         </CardContent>
//         <CardFooter className="p-4 flex justify-between items-center">
//           <div className="flex items-center space-x-4">
//             <span className="flex items-center text-muted-foreground">
//               <Heart className="w-4 h-4 mr-1" />
//               {post.likes || 0}
//             </span>
//             <span className="flex items-center text-muted-foreground">
//               <MessageCircle className="w-4 h-4 mr-1" />
//               {comments[post.id]?.length || 0}
//             </span>
//             <BookmarkButton
//               postId={post.id}
//               isBookmarked={false}
//               onToggleBookmark={handleToggleBookmark}
//             />
//           </div>
//           <Link href={`/profile/${author.id}`} passHref>
//             <div className="flex items-center space-x-2 cursor-pointer">
//               <UserAvatar className="w-6 h-6">
//                 <AvatarImage src={author.avatar_url} alt={author.username} />
//                 <AvatarFallback>
//                   {author.username?.charAt(0).toUpperCase() || "U"}
//                 </AvatarFallback>
//               </UserAvatar>
//               <span className="text-sm text-muted-foreground">
//                 {author.username || "No UserName"}
//               </span>
//             </div>
//           </Link>
//         </CardFooter>
//       </Card>
//     );
//   };

//   return (
//     <div className="container mx-auto p-4 flex flex-col items-center">
//       {posts.length === 0 && loading && (
//         <div className="flex flex-col items-center gap-6 max-w-screen-lg">
//           {Array.from({ length: 6 }).map((_, index) => (
//             <Card key={index} className="w-full min-w-[400px]">
//               <CardHeader className="p-0">
//                 <Skeleton height={200} width="100%" />
//               </CardHeader>
//               <CardContent className="p-4">
//                 <Skeleton height={30} width="80%" />
//                 <Skeleton height={20} width="100%" count={2} />
//               </CardContent>
//               <CardFooter className="p-4 flex justify-between items-center">
//                 <Skeleton width={50} />
//                 <Skeleton width={70} />
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//       )}

//       {error && !error.includes("Requested range not satisfiable") ? (
//         <p className="text-center text-red-500">Error: {error}</p>
//       ) : (
//         <div className="flex flex-col items-center gap-6 max-w-screen-lg">
//           {posts.map((post, index) => renderPostCard(post, index))}
//           {!hasMore && (
//             <div className="w-full text-center mt-4">
//               <p className="text-muted-foreground">You've reached the end.</p>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }











// "use client";

// import React, { useEffect, useState, useRef, useCallback } from "react";
// import Link from "next/link";
// import { createClient } from "@/utils/supabase/client";
// import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
// import { Book, Heart, MessageCircle } from "lucide-react";
// import Image from "next/image";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
// import { UserAvatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { marked } from "marked";
// import DOMPurify from "dompurify";
// import { Database as DB } from "@/lib/database.types";
// import Likes from "../likes";
// import BookmarkButton from "@/components/BookmarkButton";

// interface Post {
//   id: string;
//   title: string;
//   content: string;
//   created_at: string;
//   likes: number;
//   cover_image_url?: string | null;
//   profiles?: {
//     id: string;
//     username: string;
//     avatar_url: string | null;
//   };
// }

// export default function PostList() {
//   const supabase = createClient();
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [comments, setComments] = useState<Record<string, any>>({});
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const observer = useRef<IntersectionObserver | null>(null);

//   const fetchPosts = useCallback(async () => {
//     if (!hasMore) return;

//     try {
//       setLoading(true);
//       const { data: postsData, error: postsError } = await supabase
//         .from("posts")
//         .select(
//           `
//           *,
//           profiles (
//             id,
//             username,
//             avatar_url
//           )
//         `
//         )
//         .order("created_at", { ascending: false })
//         .range((page - 1) * 5, page * 5 - 1);

//       if (postsError) throw postsError;

//       if (postsData.length === 0) {
//         setHasMore(false);
//       } else {
//         setPosts((prevPosts) => {
//           const newPosts = postsData.filter(
//             (post) => !prevPosts.some((p) => p.id === post.id)
//           );
//           return [...prevPosts, ...newPosts];
//         });

//         const commentsData: Record<string, any> = {};
//         for (const post of postsData) {
//           const { data: postComments, error: commentsError } = await supabase
//             .from("comments")
//             .select("*")
//             .eq("post_id", post.id);

//           if (commentsError) {
//             console.error(`Error fetching comments for post ${post.id}:`, commentsError);
//           } else {
//             commentsData[post.id] = postComments || [];
//           }
//         }
//         setComments((prevComments) => ({ ...prevComments, ...commentsData }));
//       }
//     } catch (error) {
//       if ((error as Error).message.includes("Requested range not satisfiable")) {
//         setHasMore(false);
//       } else {
//         setError((error as Error).message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [page, hasMore, supabase]);

//   useEffect(() => {
//     fetchPosts();
//   }, [fetchPosts]);

//   const lastPostElementRef = useCallback(
//     (node: HTMLElement | null) => {
//       if (loading) return;
//       if (observer.current) observer.current.disconnect();

//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && hasMore) {
//           setPage((prevPage) => prevPage + 1);
//         }
//       });

//       if (node) observer.current.observe(node);
//     },
//     [loading, hasMore]
//   );

//   const renderPostCard = (post: Post, index: number) => {
//     const isLastElement = posts.length === index + 1;
//     const author = post.profiles || { username: "Unknown", avatar_url: null };
//     const htmlContent = marked(post.content);
//     const sanitizedHtmlContent = DOMPurify.sanitize(htmlContent);
//     const plainTextContent = sanitizedHtmlContent.replace(/<[^>]*>?/gm, "");
//     const truncatedContent = plainTextContent.substring(0, 100) + "...";

//     return (
//       <Card
//         ref={isLastElement ? lastPostElementRef : null}
//         key={post.id}
//         className="w-full min-w-[20vw] max-w-[80vw] transition-transform duration-200 ease-in-out transform hover:scale-105 cursor-pointer"
//       >
//         <CardHeader className="p-0">
//           <Image
//             src={post.cover_image_url || "/placeholder.svg"}
//             alt={post.title}
//             width={400}
//             height={200}
//             className="w-full h-48 object-cover rounded-t-lg"
//           />
//         </CardHeader>
//         <CardContent className="p-4">
//           <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors duration-200">
//             <Link href={`/post/${post.id}`}>{post.title}</Link>
//           </h3>
//           <p className="text-muted-foreground">{truncatedContent}</p>
//         </CardContent>
//         <CardFooter className="p-4 flex justify-between items-center">
//           <div className="flex items-center space-x-4">
//             <span className="flex items-center text-muted-foreground">
//               <Heart className="w-4 h-4 mr-1" />
//               {post.likes || 0}
//             </span>
//             <span className="flex items-center text-muted-foreground">
//               <MessageCircle className="w-4 h-4 mr-1" />
//               {comments[post.id]?.length || 0}
//             </span>
//             <BookmarkButton postId={post.id} isBookmarked={false} />
//           </div>
//           <div className="flex items-center space-x-2">
//             <Link href={`/profile/${author.id}`}>
//               <UserAvatar className="w-6 h-6">
//                 <AvatarImage src={author.avatar_url} alt={author.username} />
//                 <AvatarFallback>
//                   {author.username?.charAt(0).toUpperCase() || "U"}
//                 </AvatarFallback>
//               </UserAvatar>
//             </Link>
//             <Link href={`/profile/${author.id}`}>
//               <span className="text-sm text-muted-foreground">
//                 {author.username || "No UserName"}
//               </span>
//             </Link>
//           </div>
//         </CardFooter>
//       </Card>
//     );
//   };

//   return (
//     <div className="container mx-auto p-4 flex flex-col items-center">
//       {posts.length === 0 && loading && (
//         <div className="flex flex-col items-center gap-6 max-w-screen-lg">
//           {Array.from({ length: 6 }).map((_, index) => (
//             <Card key={index} className="w-full min-w-[400px]">
//               <CardHeader className="p-0">
//                 <Skeleton height={200} width="100%" />
//               </CardHeader>
//               <CardContent className="p-4">
//                 <Skeleton height={30} width="80%" />
//                 <Skeleton height={20} width="100%" count={2} />
//               </CardContent>
//               <CardFooter className="p-4 flex justify-between items-center">
//                 <Skeleton width={50} />
//                 <Skeleton width={70} />
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//       )}

//       {error && !error.includes("Requested range not satisfiable") ? (
//         <p className="text-center text-red-500">Error: {error}</p>
//       ) : (
//         <div className="flex flex-col items-center gap-6 max-w-screen-lg">
//           {posts.map((post, index) => renderPostCard(post, index))}
//           {!hasMore && (
//             <div className="w-full text-center mt-4">
//               <p className="text-muted-foreground">You've reached the end.</p>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }







// "use client";

// import React, { useEffect, useState, useRef, useCallback } from "react";
// import Link from "next/link";
// import { createClient } from "@/utils/supabase/client";
// import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
// import { Book, Heart, MessageCircle } from "lucide-react";
// import Image from "next/image";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
// import { UserAvatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { marked } from "marked";
// import DOMPurify from "dompurify";
// import BookmarkButton from "@/components/BookmarkButton";
// import { toast } from 'react-toastify';

// // Define the type for a post
// interface Post {
//   id: string;
//   title: string;
//   content: string;
//   created_at: string;
//   likes: number;
//   cover_image_url?: string | null;
//   profiles?: {
//     id: string;
//     username: string;
//     avatar_url: string | null;
//   };
// }

// export default function PostList() {
//   const supabase = createClient();
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [comments, setComments] = useState<Record<string, any>>({});
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const observer = useRef<IntersectionObserver | null>(null);

//   const fetchPosts = useCallback(async () => {
//     if (!hasMore) return; // Avoid fetching if no more posts are available

//     try {
//       setLoading(true);
//       const { data: postsData, error: postsError } = await supabase
//         .from("posts")
//         .select(
//           `
//           *,
//           profiles (
//             id,
//             username,
//             avatar_url
//           )
//         `
//         )
//         .order("created_at", { ascending: false })
//         .range((page - 1) * 5, page * 5 - 1);

//       if (postsError) throw postsError;

//       if (postsData.length === 0) {
//         setHasMore(false);
//       } else {
//         setPosts((prevPosts) => {
//           const newPosts = postsData.filter(
//             (post) => !prevPosts.some((p) => p.id === post.id)
//           );
//           return [...prevPosts, ...newPosts];
//         });

//         // Fetch comments for each post
//         const commentsData: Record<string, any> = {};
//         for (const post of postsData) {
//           const { data: postComments, error: commentsError } = await supabase
//             .from("comments")
//             .select("*")
//             .eq("post_id", post.id);

//           if (commentsError) {
//             console.error(`Error fetching comments for post ${post.id}:`, commentsError);
//           } else {
//             commentsData[post.id] = postComments || [];
//           }
//         }
//         setComments((prevComments) => ({ ...prevComments, ...commentsData }));
//       }
//     } catch (error) {
//       if ((error as Error).message.includes("Requested range not satisfiable")) {
//         setHasMore(false);
//       } else {
//         setError((error as Error).message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [page, hasMore, supabase]);

//   useEffect(() => {
//     fetchPosts();
//   }, [fetchPosts]);

//   const lastPostElementRef = useCallback(
//     (node: HTMLElement | null) => {
//       if (loading) return;
//       if (observer.current) observer.current.disconnect();

//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && hasMore) {
//           setPage((prevPage) => prevPage + 1);
//         }
//       });

//       if (node) observer.current.observe(node);
//     },
//     [loading, hasMore]
//   );

//   // Function to handle bookmark toggle
//   const handleToggleBookmark = async (postId: string) => {
//     try {
//       const post = posts.find((p) => p.id === postId);
//       if (!post) return; // Post not found

//       const isBookmarked = false; // Assume bookmark is not set initially or set based on your state
//       if (isBookmarked) {
//         const { error } = await supabase
//           .from("bookmarks")
//           .delete()
//           .eq("post_id", postId);
//         if (error) throw error;

//         toast.success("Bookmark removed!");
//       } else {
//         const { error } = await supabase
//           .from("bookmarks")
//           .insert({ post_id: postId });
//         if (error) throw error;

//         toast.success("Post bookmarked!");
//       }

//       // Optionally, you can update local state here to reflect the bookmark status
//     } catch (error) {
//       console.error("Error updating bookmark:", error);
//       toast.error("Failed to update bookmark");
//     }
//   };

//   const renderPostCard = (post: Post, index: number) => {
//     const isLastElement = posts.length === index + 1;
//     const author = post.profiles || { username: "Unknown", avatar_url: null };
//     const htmlContent = marked(post.content);
//     const sanitizedHtmlContent = DOMPurify.sanitize(htmlContent);
//     const plainTextContent = sanitizedHtmlContent.replace(/<[^>]*>?/gm, '');
//     const truncatedContent = plainTextContent.substring(0, 100) + '...';

//     return (
//       <Card
//         key={`${post.id}-${index}`}
//         ref={isLastElement ? lastPostElementRef : null}
//         className="w-full min-w-[20vw] max-w-[80vw] transition-transform duration-200 ease-in-out transform hover:scale-105 cursor-pointer"
//       >
//         <CardHeader className="p-0">
//           <Image
//             src={post.cover_image_url || "/placeholder.svg"}
//             alt={post.title}
//             width={400}
//             height={200}
//             className="w-full h-48 object-cover rounded-t-lg"
//           />
//         </CardHeader>
//         <CardContent className="p-4">
//           <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors duration-200">
//             {post.title}
//           </h3>
//           <p className="text-muted-foreground">{truncatedContent}...</p>
//         </CardContent>
//         <CardFooter className="p-4 flex justify-between items-center">
//           <div className="flex items-center space-x-4">
//             <span className="flex items-center text-muted-foreground">
//               <Heart className="w-4 h-4 mr-1" />
//               {post.likes || 0}
//             </span>
//             <span className="flex items-center text-muted-foreground">
//               <MessageCircle className="w-4 h-4 mr-1" />
//               {comments[post.id]?.length || 0}
//             </span>
//             {/* Pass the handleToggleBookmark function */}
//             <BookmarkButton
//               postId={post.id}
//               isBookmarked={false} // Replace with actual state
//               onToggleBookmark={handleToggleBookmark}
//             />
//           </div>
//           <div className="flex items-center space-x-2">
//             <UserAvatar className="w-6 h-6">
//               <AvatarImage src={author.avatar_url} alt={author.username} />
//               <AvatarFallback>
//                 {author.username?.charAt(0).toUpperCase() || "U"}
//               </AvatarFallback>
//             </UserAvatar>
//             <span className="text-sm text-muted-foreground">
//               {author.username || "No UserName"}
//             </span>
//           </div>
//         </CardFooter>
//       </Card>
//     );
//   };

//   return (
//     <div className="container mx-auto p-4 flex flex-col items-center">
//       {posts.length === 0 && loading && (
//         <div className="flex flex-col items-center gap-6 max-w-screen-lg">
//           {Array.from({ length: 6 }).map((_, index) => (
//             <Card key={index} className="w-full min-w-[400px]">
//               <CardHeader className="p-0">
//                 <Skeleton height={200} width="100%" />
//               </CardHeader>
//               <CardContent className="p-4">
//                 <Skeleton height={30} width="80%" />
//                 <Skeleton height={20} width="100%" />
//               </CardContent>
//               <CardFooter className="p-4">
//                 <div className="flex items-center space-x-4">
//                   <Skeleton circle width={24} height={24} />
//                   <Skeleton height={20} width="50%" />
//                 </div>
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//       )}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-screen-lg">
//         {posts.map(renderPostCard)}
//       </div>
//     </div>
//   );
// }










// "use client";

// import React, { useEffect, useState, useRef, useCallback } from "react";
// import Link from "next/link";
// import { createClient } from "@/utils/supabase/client";
// import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
// import { Book, Heart, MessageCircle } from "lucide-react";
// import Image from "next/image";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
// import { UserAvatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { marked } from "marked";
// import DOMPurify from "dompurify";
// import BookmarkButton from "@/components/BookmarkButton";
// import { toast } from 'react-toastify';

// // Define the type for a post
// interface Post {
//   id: string;
//   title: string;
//   content: string;
//   created_at: string;
//   likes: number;
//   cover_image_url?: string | null;
//   profiles?: {
//     id: string;
//     username: string;
//     avatar_url: string | null;
//   };
// }

// export default function PostList() {
//   const supabase = createClient();
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [comments, setComments] = useState<Record<string, any>>({});
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const observer = useRef<IntersectionObserver | null>(null);

//   const fetchPosts = useCallback(async () => {
//     if (!hasMore) return; // Avoid fetching if no more posts are available

//     try {
//       setLoading(true);
//       const { data: postsData, error: postsError } = await supabase
//         .from("posts")
//         .select(
//           `
//           *,
//           profiles (
//             id,
//             username,
//             avatar_url
//           )
//         `
//         )
//         .order("created_at", { ascending: false })
//         .range((page - 1) * 5, page * 5 - 1);

//       if (postsError) throw postsError;

//       if (postsData.length === 0) {
//         setHasMore(false);
//       } else {
//         setPosts((prevPosts) => {
//           const newPosts = postsData.filter(
//             (post) => !prevPosts.some((p) => p.id === post.id)
//           );
//           return [...prevPosts, ...newPosts];
//         });

//         // Fetch comments for each post
//         const commentsData: Record<string, any> = {};
//         for (const post of postsData) {
//           const { data: postComments, error: commentsError } = await supabase
//             .from("comments")
//             .select("*")
//             .eq("post_id", post.id);

//           if (commentsError) {
//             console.error(`Error fetching comments for post ${post.id}:`, commentsError);
//           } else {
//             commentsData[post.id] = postComments || [];
//           }
//         }
//         setComments((prevComments) => ({ ...prevComments, ...commentsData }));
//       }
//     } catch (error) {
//       if ((error as Error).message.includes("Requested range not satisfiable")) {
//         setHasMore(false);
//       } else {
//         setError((error as Error).message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [page, hasMore, supabase]);

//   useEffect(() => {
//     fetchPosts();
//   }, [fetchPosts]);

//   const lastPostElementRef = useCallback(
//     (node: HTMLElement | null) => {
//       if (loading) return;
//       if (observer.current) observer.current.disconnect();

//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && hasMore) {
//           setPage((prevPage) => prevPage + 1);
//         }
//       });

//       if (node) observer.current.observe(node);
//     },
//     [loading, hasMore]
//   );

//   // Function to handle bookmark toggle
//   const handleToggleBookmark = async (postId: string) => {
//     try {
//       const post = posts.find((p) => p.id === postId);
//       if (!post) return; // Post not found

//       const isBookmarked = false; // Assume bookmark is not set initially or set based on your state
//       if (isBookmarked) {
//         const { error } = await supabase
//           .from("bookmarks")
//           .delete()
//           .eq("post_id", postId);
//         if (error) throw error;

//         toast.success("Bookmark removed!");
//       } else {
//         const { error } = await supabase
//           .from("bookmarks")
//           .insert({ post_id: postId });
//         if (error) throw error;

//         toast.success("Post bookmarked!");
//       }

//       // Optionally, you can update local state here to reflect the bookmark status
//     } catch (error) {
//       console.error("Error updating bookmark:", error);
//       toast.error("Failed to update bookmark");
//     }
//   };

//   const renderPostCard = (post: Post, index: number) => {
//     const isLastElement = posts.length === index + 1;
//     const author = post.profiles || { username: "Unknown", avatar_url: null };
//     const htmlContent = marked(post.content);
//     const sanitizedHtmlContent = DOMPurify.sanitize(htmlContent);
//     const plainTextContent = sanitizedHtmlContent.replace(/<[^>]*>?/gm, '');
//     const truncatedContent = plainTextContent.substring(0, 100) + '...';

//     return (
//       <Card
//         key={`${post.id}-${index}`}
//         ref={isLastElement ? lastPostElementRef : null}
//         className="w-full max-w-md mx-auto mb-4" // Adjusted to center-align and add margin between cards
//       >
//         <CardHeader className="p-0">
//           <Image
//             src={post.cover_image_url || "/placeholder.svg"}
//             alt={post.title}
//             width={400}
//             height={200}
//             className="w-full h-48 object-cover rounded-t-lg"
//           />
//         </CardHeader>
//         <CardContent className="p-4">
//           <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors duration-200">
//             {post.title}
//           </h3>
//           <p className="text-muted-foreground">{truncatedContent}...</p>
//         </CardContent>
//         <CardFooter className="p-4 flex flex-col md:flex-row justify-between items-center">
//           <div className="flex items-center space-x-4 mb-4 md:mb-0">
//             <span className="flex items-center text-muted-foreground">
//               <Heart className="w-4 h-4 mr-1" />
//               {post.likes || 0}
//             </span>
//             <span className="flex items-center text-muted-foreground">
//               <MessageCircle className="w-4 h-4 mr-1" />
//               {comments[post.id]?.length || 0}
//             </span>
//             {/* Pass the handleToggleBookmark function */}
//             <BookmarkButton
//               postId={post.id}
//               isBookmarked={false} // Replace with actual state
//               onToggleBookmark={handleToggleBookmark}
//             />
//           </div>
//           <Link href={`/profile/${author.id}`} className="flex items-center space-x-2">
//             <UserAvatar className="w-6 h-6">
//               <AvatarImage src={author.avatar_url || "/default-avatar.png"} alt={author.username} />
//               <AvatarFallback>
//                 {author.username?.charAt(0).toUpperCase() || "U"}
//               </AvatarFallback>
//             </UserAvatar>
//             <span className="text-sm text-muted-foreground">
//               {author.username || "No UserName"}
//             </span>
//           </Link>
//         </CardFooter>
//       </Card>
//     );
//   };

//   return (
//     <div className="container mx-auto p-4">
//       {posts.length === 0 && loading && (
//         <div className="flex flex-col items-center gap-6 max-w-screen-lg">
//           {Array.from({ length: 6 }).map((_, index) => (
//             <Card key={index} className="w-full min-w-[400px]">
//               <CardHeader className="p-0">
//                 <Skeleton height={200} width="100%" />
//               </CardHeader>
//               <CardContent className="p-4">
//                 <Skeleton height={30} width="80%" />
//                 <Skeleton height={20} width="100%" />
//               </CardContent>
//               <CardFooter className="p-4">
//                 <div className="flex items-center space-x-4">
//                   <Skeleton circle width={24} height={24} />
//                   <Skeleton height={20} width="50%" />
//                 </div>
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//       )}
//       <div className="flex flex-col space-y-4">
//         {posts.map(renderPostCard)}
//       </div>
//     </div>
//   );
// }








// "use client";

// import React, { useEffect, useState, useRef, useCallback } from "react";
// import Link from "next/link";
// import { createClient } from "@/utils/supabase/client";
// import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
// import { Book, Heart, MessageCircle } from "lucide-react";
// import Image from "next/image";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
// import { UserAvatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { marked } from "marked";
// import DOMPurify from "dompurify";
// import BookmarkButton from "@/components/BookmarkButton";
// import { toast } from 'react-toastify';

// interface Post {
//   id: string;
//   title: string;
//   content: string;
//   created_at: string;
//   likes: number;
//   cover_image_url?: string | null;
//   profiles?: {
//     id: string;
//     username: string;
//     avatar_url: string | null;
//   };
// }

// export default function PostList() {
//   const supabase = createClient();
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [comments, setComments] = useState<Record<string, any>>({});
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const observer = useRef<IntersectionObserver | null>(null);

//   const fetchPosts = useCallback(async () => {
//     if (!hasMore) return; // Avoid fetching if no more posts are available

//     try {
//       setLoading(true);
//       const { data: postsData, error: postsError } = await supabase
//         .from("posts")
//         .select(
//           `
//           *,
//           profiles (
//             id,
//             username,
//             avatar_url
//           )
//         `
//         )
//         .order("created_at", { ascending: false })
//         .range((page - 1) * 5, page * 5 - 1);

//       if (postsError) throw postsError;

//       if (postsData.length === 0) {
//         setHasMore(false);
//       } else {
//         // Only update posts if new posts are fetched
//         setPosts((prevPosts) => {
//           const newPosts = postsData.filter(
//             (post) => !prevPosts.some((p) => p.id === post.id)
//           );
//           return [...prevPosts, ...newPosts];
//         });

//         // Fetch comments for each post
//         const commentsData: Record<string, any> = {};
//         for (const post of postsData) {
//           const { data: postComments, error: commentsError } = await supabase
//             .from("comments")
//             .select("*")
//             .eq("post_id", post.id);

//           if (commentsError) {
//             console.error(`Error fetching comments for post ${post.id}:`, commentsError);
//           } else {
//             commentsData[post.id] = postComments || [];
//           }
//         }
//         setComments((prevComments) => ({ ...prevComments, ...commentsData }));
//       }
//     } catch (error) {
//       if ((error as Error).message.includes("Requested range not satisfiable")) {
//         setHasMore(false);
//       } else {
//         setError((error as Error).message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [page, hasMore, supabase]);

//   useEffect(() => {
//     fetchPosts();
//   }, [fetchPosts]);

//   const lastPostElementRef = useCallback(
//     (node: HTMLElement | null) => {
//       if (loading) return;
//       if (observer.current) observer.current.disconnect();

//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && hasMore) {
//           setPage((prevPage) => prevPage + 1);
//         }
//       });

//       if (node) observer.current.observe(node);
//     },
//     [loading, hasMore]
//   );

//   const handleBookmarkToggle = async (postId: string) => {
//     try {
//       const { data: bookmarks, error: bookmarksError } = await supabase
//         .from('bookmarks')
//         .select('*')
//         .eq('post_id', postId);

//       if (bookmarksError) throw bookmarksError;

//       if (bookmarks.length > 0) {
//         // Remove bookmark
//         const { error: deleteError } = await supabase
//           .from('bookmarks')
//           .delete()
//           .eq('post_id', postId);

//         if (deleteError) throw deleteError;

//         toast.success('Bookmark removed!');
//       } else {
//         // Add bookmark
//         const { error: insertError } = await supabase
//           .from('bookmarks')
//           .insert({ post_id: postId });

//         if (insertError) throw insertError;

//         toast.success('Post bookmarked!');
//       }

//       // Refresh the posts to reflect bookmark changes
//       fetchPosts();
//     } catch (error) {
//       console.error('Error updating bookmark:', error);
//       toast.error('Failed to update bookmark');
//     }
//   };

//   const renderPostCard = (post: Post, index: number) => {
//     const isLastElement = posts.length === index + 1;
//     const author = post.profiles || { username: "Unknown", avatar_url: null };
//     const htmlContent = marked(post.content);
//     const sanitizedHtmlContent = DOMPurify.sanitize(htmlContent);
//     const plainTextContent = sanitizedHtmlContent.replace(/<[^>]*>?/gm, '');
//     const truncatedContent = plainTextContent.substring(0, 100) + '...';

//     return (
//       <Link href={`/post/${post.id}`} key={`${post.id}-${index}`} passHref>
//         <Card
//           ref={isLastElement ? lastPostElementRef : null}
//           className="w-full max-w-lg mx-auto mb-6 p-4 transition-transform duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
//         >
//           <CardHeader className="p-0">
//             <Image
//               src={post.cover_image_url || "/placeholder.svg"}
//               alt={post.title}
//               width={600}
//               height={300}
//               className="w-full h-60 object-cover rounded-t-lg"
//             />
//           </CardHeader>
//           <CardContent className="p-4">
//             <h3 className="text-2xl font-semibold mb-2 hover:text-blue-600 transition-colors duration-300">
//               {post.title}
//             </h3>
//             <p className="text-gray-700 line-clamp-3">
//               {truncatedContent}
//             </p>
//           </CardContent>
//           <CardFooter className="flex justify-between items-center p-4">
//             <div className="flex items-center space-x-4">
//               <span className="flex items-center text-gray-600">
//                 <Heart className="w-5 h-5 mr-1" />
//                 {post.likes || 0}
//               </span>
//               <span className="flex items-center text-gray-600">
//                 <MessageCircle className="w-5 h-5 mr-1" />
//                 {comments[post.id]?.length || 0}
//               </span>
//               <BookmarkButton
//                 postId={post.id}
//                 isBookmarked={false} // Adjust based on actual bookmarked state
//                 onToggleBookmark={handleBookmarkToggle}
//               />
//             </div>
//             <Link href={`/profile/${author.id}`}>
//               <div className="flex items-center space-x-2 cursor-pointer">
//                 <UserAvatar className="w-8 h-8">
//                   <AvatarImage src={author.avatar_url || "/placeholder-avatar.svg"} alt={author.username} />
//                   <AvatarFallback>
//                     {author.username?.charAt(0).toUpperCase() || "U"}
//                   </AvatarFallback>
//                 </UserAvatar>
//                 <span className="text-sm text-gray-600">{author.username || "Unknown"}</span>
//               </div>
//             </Link>
//           </CardFooter>
//         </Card>
//       </Link>
//     );
//   };

//   return (
//     <div className="container mx-auto p-4">
//       {posts.length === 0 && loading && (
//         <div className="flex flex-col items-center gap-6">
//           {Array.from({ length: 6 }).map((_, index) => (
//             <Card key={index} className="w-full max-w-lg mx-auto mb-6 p-4">
//               <CardHeader className="p-0">
//                 <Skeleton height={300} width="100%" />
//               </CardHeader>
//               <CardContent className="p-4">
//                 <Skeleton height={30} width="80%" />
//                 <Skeleton height={20} width="100%" count={2} />
//               </CardContent>
//               <CardFooter className="flex justify-between items-center p-4">
//                 <Skeleton width={50} />
//                 <Skeleton width={70} />
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//       )}

//       {error && !error.includes("Requested range not satisfiable") ? (
//         <p className="text-center text-red-500">Error: {error}</p>
//       ) : (
//         <div className="flex flex-col items-center gap-6">
//           {posts.map((post, index) => renderPostCard(post, index))}
//           {!hasMore && (
//             <div className="w-full text-center mt-4">
//               <p className="text-gray-600">You've reached the end.</p>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }



