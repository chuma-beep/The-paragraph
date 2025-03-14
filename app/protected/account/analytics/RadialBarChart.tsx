"use client"

import { TrendingUp } from 'lucide-react'
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

interface RadialChartProps {
  data: {
    post_id: string;
    post_title: string;
    total_views: number;
    total_likes: number;
    total_comments: number;
    total_bookmarks: number;
    recent_views: string;
  }[];
  dataType: 'views' | 'likes' | 'comments' | 'bookmarks' ;
}

// export function RadialChartCard({ data, dataType }: RadialChartProps) {
// //   const totalValue = data.reduce((sum, item) => sum + item[`total_${dataType}`], 0);
// const totalValue = data.reduce((sum, item) => sum + (item[`total_${dataType}`] || 0), 0);

  
//   const chartData = [
//     { [dataType]: totalValue, fill: `var(--color-${dataType})` },
//   ];

//   const chartConfig = {
//     [dataType]: {
//       label: dataType.charAt(0).toUpperCase() + dataType.slice(1),
//       color: `hsl(var(--chart-${dataType === 'views' ? '1' : dataType === 'likes' ? '2' : '3'}))`,

//     },
//   } satisfies ChartConfig;

//   return (
//     <Card className="flex flex-col">
//       <CardHeader className="items-center pb-0">
//         <CardTitle>Radial Chart - {chartConfig[dataType].label}</CardTitle>
//         <CardDescription>Current Data Distribution</CardDescription>
//       </CardHeader>
//       <CardContent className="flex-1 pb-0">
//         <ChartContainer
//           config={chartConfig}
//           className="mx-auto aspect-square max-h-[250px]"
//         >
//           <RadialBarChart
//             data={chartData}
//             startAngle={0}
//             endAngle={250}
//             innerRadius={80}
//             outerRadius={110}
//           >
//             <PolarGrid
//               gridType="circle"
//               radialLines={false}
//               stroke="none"
//               className="first:fill-muted last:fill-background"
//               polarRadius={[86, 74]}
//             />
//             <RadialBar dataKey={dataType} background cornerRadius={10} />
//             <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
//               <Label
//                 content={({ viewBox }) => {
//                   if (viewBox && "cx" in viewBox && "cy" in viewBox) {
//                     return (
//                       <text
//                         x={viewBox.cx}
//                         y={viewBox.cy}
//                         textAnchor="middle"
//                         dominantBaseline="middle"
//                       >
//                         <tspan
//                           x={viewBox.cx}
//                           y={viewBox.cy}
//                           className="fill-foreground text-4xl font-bold"
//                         >
//                           {totalValue.toLocaleString()}
//                         </tspan>
//                         <tspan
//                           x={viewBox.cx}
//                           y={(viewBox.cy || 0) + 24}
//                           className="fill-muted-foreground"
//                         >
//                          {/* <tspan
//                           x={viewBox.cx}
//                           y={viewBox.cy}
//                           className="fill-muted-foreground"
//                         > */}
//                           {chartConfig[dataType].label}
//                         </tspan>
//                       </text>
//                     )
//                   }
//                 }}
//               />
//             </PolarRadiusAxis>
//           </RadialBarChart>
//         </ChartContainer>
//       </CardContent>
//       <CardFooter className="flex-col gap-2 text-sm">
//       </CardFooter>
//     </Card>
//   )
// }



export function RadialChartCard({ data, dataType }: RadialChartProps) {
  // Safeguard for dataType
  const validDataTypes = ['views', 'likes', 'comments', 'bookmarks'] as const;
  if (!validDataTypes.includes(dataType)) {
    console.error('Invalid dataType:', dataType);
    return null; // Or a fallback UI
  }

  console.log('dataType:', dataType);
  console.log('data:', data);

  // Calculate totalValue
  const totalValue = data.reduce((sum, item) => {
    const value = item[`total_${dataType}`];
    console.log(`Summing ${dataType}:`, value);
    return sum + (value || 0);
  }, 0);

  const chartData = [
    { [dataType]: totalValue, fill: `var(--color-${dataType})` },
  ];

  console.log('Chart data:', chartData);

  const chartConfig = {
    [dataType]: {
      label: dataType.charAt(0).toUpperCase() + dataType.slice(1),
      color: `hsl(var(--chart-${dataType === 'views' ? '1' : dataType === 'likes' ? '2' : '3'}))`,
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Radial Chart - {chartConfig[dataType].label}</CardTitle>
        <CardDescription>Current Data Distribution</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={250}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey={dataType} background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {totalValue.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {chartConfig[dataType].label}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm"></CardFooter>
    </Card>
  );
}
