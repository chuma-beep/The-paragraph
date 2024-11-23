'use client';

import { useState, useEffect } from "react";
import { TrendingUp } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { RadialChartCard } from "./RadialBarChart";



import
 { 
  Area,
  AreaChart,
  Line,
  LineChart,
  CartesianGrid,
  XAxis, Label, 
  PolarGrid, 
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart  
} from "recharts";

import 
{ 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import {
   ChartConfig,
   ChartContainer,
   ChartTooltip,
   ChartTooltipContent,
} from "@/components/ui/chart"

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
  // const [selectCard, setSelectCart] = useState(cardTypes[0].value)
  const [selectedDataType, setSelectedDataType] = useState<'views' | 'likes' | 'comments'>('views');


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const supabase = createClient();
  
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) throw new Error("User not authenticated");
  
        const { data, error } = await supabase.rpc("get_user_post_analytics", { user_id: user.id });
        console.log("RPC data:", data);

        if (error) throw error;
  
        if (Array.isArray(data)) {
          setAnalyticsData(data);
          console.log("Analytics Data set:", data);
        } else {
          console.error("Unexpected RPC response:", data);
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);


  // date
  const date = new Date();
  const showMonth = new Intl.DateTimeFormat('en-US', {month: 'long'}).format(date);
  const showYear = date.getUTCFullYear()



   //card types
     const cardTypes = [
      { value: "views", label: "views Card" },
      { value: "comments", label: "comments Card" },
      { value: "likes", label: "likes Card" },
     ]


  // const views total_views"
  
  const ChartConfig = {
    comments: {
      label: "comments" ,
      color: "hsl(var(--chart-1))",
    },
    likes: {
      label: "likes" ,
      color: "hsl(var(--chart-2))",
    },
    views:{
      label: "views",
      color: "hsl(var(--chart-3))",
    }
  } satisfies ChartConfig;



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
            <Card className="flex flex-col justify-center">
              <CardHeader>
                <CardDescription>Blog Performance</CardDescription>
                <CardTitle>Trend of  Activities</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <SkeletonChart />
                ) : (
                 <ChartContainer config={ChartConfig} >
                   <LineChart
                   accessibilityLayer
                   data={analyticsData}
                   margin={{
                     left: 12,
                     right: 12,
                   }}
                   >
                    <CartesianGrid vertical={false}/>
                    <XAxis
                     dataKey="post_title"
                     tickLine={false}
                     axisLine={false}
                     tickMargin={8}
                     tickFormatter={(value) => value.slice(0, 10) + '...'}
                     />
                     <ChartTooltip
                     cursor={false}
                     content={<ChartTooltipContent indicator="dot" />}
                     />
                     <Line
                     dataKey="total_likes"
                     type="natural"
                     fill="var(--color-likes)"
                     fillOpacity={0.4}
                     stroke="var(--color-likes)"
                    //  stackId="a"
                     />
                     <Line
                     dataKey="total_comments"
                     type="natural"
                     fill="var(--color-comments)"
                     fillOpacity={0.4}
                     stroke="var(--color-comments)"
                    //  stackId="a"
                     />
                     <Line
                     dataKey="total_views"
                     type="natural"
                     fill="var(--color-views)"
                     fillOpacity={0.4}
                     stroke="var(--color-views)"
                    //  stackId="a"
                     />
                   </LineChart>
                 </ChartContainer>
                )}
              </CardContent>
            </Card>

                 {/* Radial Chart Card */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardDescription>Data Distribution</CardDescription>
                <CardTitle>Select Data Type</CardTitle>
              </CardHeader>
              <CardContent>
                <Select onValueChange={(value) => setSelectedDataType(value as 'views' | 'likes' | 'comments')} defaultValue={selectedDataType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a data type" />
                  </SelectTrigger>
                  <SelectContent>
                    {cardTypes.map((cardType) => (
                      <SelectItem key={cardType.value} value={cardType.value}>
                        {cardType.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {loading ? (
                  <SkeletonChart />
                ) : (
                  <RadialChartCard 
                  data={analyticsData}
                   dataType={selectedDataType} />
                )}
              </CardContent>
            </Card>

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

