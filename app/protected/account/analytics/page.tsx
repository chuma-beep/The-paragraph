

'use client';

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
import { createClient } from "@/utils/supabase/client";
import { MdOutlineAnalytics } from "react-icons/md";

interface AnalyticsData {
  post_id: string;
  post_title: string;
  total_views: number;
  total_likes: number;
  total_comments: number;
  total_bookmarks: number;
  recent_views: string;
}

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const fetchData = async () => {
      setLoading(true);

      try {
        // Get the logged-in user's ID
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error("Error fetching user:", userError);
          setLoading(false);
          return;
        }

        // Fetch analytics data from the custom function
        const { data, error } = await supabase.rpc("get_user_post_analytics", {
          user_id: user.id,
        });

        if (error) {
          console.error("Error fetching analytics data:", error);
        } else {
          setAnalyticsData(data || []);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4">
        <span className="lg:hidden">
          <MdOutlineAnalytics className="w-6 h-6" />
          <span className="sr-only">Home</span>
        </span>
        <h1 className="flex-1 text-lg font-semibold">Blog Analytics</h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid gap-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Blog Analytics */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardDescription>Blog Performance</CardDescription>
                <CardTitle>Total Posts: {analyticsData.length}</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <SkeletonChart />
                ) : (
                  <BarChart
                    data={analyticsData.map((item) => ({
                      name: item.post_title,
                      count: item.total_views,
                    }))}
                  />
                )}
              </CardContent>
            </Card>

            {/* Recent Views */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardDescription>Recent Views</CardDescription>
                <CardTitle>Latest Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? <SkeletonChart /> : <TimeseriesChart data={analyticsData} />}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

// Skeleton components
function Skeleton({ width, height }: { width?: string; height?: string }) {
  return (
    <div
      className="bg-gray-300 animate-pulse rounded"
      style={{ width: width || "100%", height: height || "16px" }}
    />
  );
}

function SkeletonChart() {
  return (
    <div className="w-full h-40 bg-gray-300 animate-pulse rounded" />
  );
}

function BarChart({ data }: { data: { name: string; count: number }[] }) {
  return (
    <ResponsiveBar
      data={data}
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

function TimeseriesChart({ data }: { data: AnalyticsData[] }) {
  return (
    <ResponsiveLine
      data={[
        {
          id: "Views",
          data: data.map((item) => ({
            x: new Date(item.recent_views).toISOString(),
            y: item.total_views,
          })),
        },
      ]}
      margin={{ top: 10, right: 20, bottom: 40, left: 40 }}
      xScale={{ type: "time", format: "%Y-%m-%d", precision: "day" }}
      xFormat="time:%Y-%m-%d"
      yScale={{ type: "linear", min: 0 }}
      axisBottom={{ tickSize: 0, tickPadding: 16 }}
      axisLeft={{ tickSize: 0, tickPadding: 16 }}
      colors={["#2563eb"]}
      useMesh
      theme={{
        grid: { line: { stroke: "#f3f4f6" } },
        tooltip: { container: { fontSize: "12px", borderRadius: "6px" } },
      }}
    />
  );
}
