'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CiMenuKebab } from "react-icons/ci";
import { createClient } from '@/utils/supabase/client';




// This data should be replaced with real data from your blog
const topPosts = [
  { id: 1, title: 'Getting Started with Next.js 13', views: 1500 },
  { id: 2, title: 'Understanding React Hooks', views: 1200 },
  { id: 3, title: 'CSS Grid Layout Explained', views: 1000 },
  { id: 4, title: 'TypeScript Best Practices', views: 950 },
  { id: 5, title: 'Building Responsive Layouts', views: 900 },
];

export function ComponentsBlogSidebar() {
  const supabase = createClient();  
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);  // State to store fetched tags
  const [loading, setLoading] = useState(true);    // State for loading
  const [error, setError] = useState<string | null>(null);  // State for error

  //  Fetch Tags from the database
   useEffect(() => {
    const fectchTags = async () => {
      try{
        const { data, error } = await supabase
        .from('tags').select('*,name');
        if(error) throw error;
        setTags(data.map((tag: { name: string}) => tag.name));
      }
      catch(error: any){ 
        setError(error.message);
      }finally{
        setLoading(false);
      }
    }
     fectchTags();
   },[])




  return (
    <>
      {/* Floating icon button for medium screens */}
      <button
        className="fixed mb-10 bottom-5 right-4 p-2 bg-blue-300 text-white rounded-full md:hidden z-50 shadow-lg animate-float"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle Sidebar"
      >
        <CiMenuKebab className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-transparent shadow-lg transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative md:top-auto md:left-auto md:shadow-none md:block md:w-64`}
      >
        <div className="space-y-6 p-4">
          <Card >
            <CardHeader>
              <CardTitle>Popular Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Link href={`/tags/${tag.toLowerCase()}`} key={tag}>
                      <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Posts This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <ul className="space-y-2">
                  {topPosts.map((post) => (
                    <li key={post.id}>
                      <Link href={`/posts/${post.id}`} className="text-sm hover:underline">
                        {post.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">{post.views} views</p>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </aside>

      {/* Overlay for when sidebar is open on smaller screens */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* CSS for the floating effect */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translatey(0px);
          }
          50% {
            transform: translatey(-10px);
          }
          100% {
            transform: translatey(0px);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
