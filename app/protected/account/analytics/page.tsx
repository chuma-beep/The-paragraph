'use client'

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";
import { createClient } from '@/utils/supabase/client';
import { MdOutlineAnalytics } from "react-icons/md";

// types.ts
export interface AnalyticsData {
  date: string;
  count: number;
}

export interface TopPostData {
  title: string;
  views: number;
}

export interface CommentData {
  author: string;
  content: string;
}

export default function Analytics() {
  const [viewsData, setViewsData] = useState<AnalyticsData[]>([]);
  const [topPosts, setTopPosts] = useState<TopPostData[]>([]);
  const [recentComments, setRecentComments] = useState<CommentData[]>([]);

  useEffect(() => {
    const supabase = createClient();

    const fetchViews = async () => {
      const { data, error } = await supabase
        .from('views')
        .select('date, count')
        .order('date', { ascending: true });

      if (error) {
        console.error("Error fetching views:", error);
      } else {
        setViewsData(data || []);
      }
    };

    const fetchTopPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('title, views')
        .order('views', { ascending: false })
        // .limit(5);

      if (error) {
        console.error("Error fetching top posts:", error);
      } else {
        setTopPosts(data || []);
      }
    };

    const fetchRecentComments = async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('author, content')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching comments:", error);
      } else {
        setRecentComments(data || []);
      }
    };

    fetchViews();
    fetchTopPosts();
    fetchRecentComments();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4">
        <span  className="lg:hidden" >
          <MdOutlineAnalytics className="w-6 h-6"/>
          <span className="sr-only">Home</span>
        </span>
        <h1 className="flex-1 text-lg font-semibold">Blog Analytics</h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid gap-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Blog Views */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardDescription>Blog Views</CardDescription>
                <CardTitle>
                  {viewsData.reduce((acc, item) => acc + item.count, 0)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TimeseriesChart data={viewsData} />
              </CardContent>
            </Card>

            {/* Top Performing Posts */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardDescription>Top Performing Posts</CardDescription>
                <CardTitle>Top 5</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart data={topPosts} />
              </CardContent>
            </Card>

            {/* Recent Comments */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardDescription>Recent Comments</CardDescription>
                <CardTitle>Latest 10</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Author</TableHead>
                      <TableHead>Comment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentComments.map((comment, index) => (
                      <TableRow key={index}>
                        <TableCell>{comment.author}</TableCell>
                        <TableCell>{comment.content}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

// Pass data as props to make charts dynamic
interface BarChartProps {
  data: TopPostData[];
}

function BarChart({ data }: BarChartProps) {
  return (
    <ResponsiveBar
      data={data.map((post) => ({ name: post.title, count: post.views }))}
      keys={["count"]}
      indexBy="name"
      margin={{ top: 0, right: 0, bottom: 40, left: 40 }}
      padding={0.3}
      colors={["#2563eb"]}
      axisBottom={{ tickSize: 0, tickPadding: 16 }}
      axisLeft={{ tickSize: 0, tickValues: 4, tickPadding: 16 }}
      theme={{
        grid: { line: { stroke: "#f3f4f6" } },
        tooltip: { container: { fontSize: "12px", borderRadius: "6px" } },
      }}
    />
  );
}

interface TimeseriesChartProps {
  data: AnalyticsData[];
}

function TimeseriesChart({ data }: TimeseriesChartProps) {
  return (
    <ResponsiveLine
      data={[
        {
          id: "Views",
          data: data.map((item) => ({ x: item.date, y: item.count })),
        },
      ]}
      margin={{ top: 10, right: 20, bottom: 40, left: 40 }}
      xScale={{ type: "time", format: "%Y-%m-%d", useUTC: false, precision: "day" }}
      xFormat="time:%Y-%m-%d"
      yScale={{ type: "linear", min: 0 }}
      axisBottom={{ tickSize: 0, tickPadding: 16, format: "%d", tickValues: "every 1 day" }}
      axisLeft={{ tickSize: 0, tickValues: 5, tickPadding: 16 }}
      colors={["#2563eb"]}
      useMesh
      theme={{
        grid: { line: { stroke: "#f3f4f6" } },
        tooltip: { container: { fontSize: "12px", borderRadius: "6px" } },
      }}
    />
  );
}
