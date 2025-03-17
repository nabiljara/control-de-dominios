"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Loader2 } from "lucide-react";

interface ProviderAreaChartProps {
  data: Record<string, string | number>[];
  loading: boolean;
}

export function ProviderAreaChart({ data, loading }: ProviderAreaChartProps) {
  const allProviders = new Set<string>();
  data.forEach((entry) => {
    Object.keys(entry).forEach((key) => {
      if (key !== "month") allProviders.add(key);
    });
  });

  const chartConfig = Array.from(allProviders).reduce(
    (acc, provider, index) => {
      acc[provider] = {
        label: provider.charAt(0).toUpperCase() + provider.slice(1),
        color: `hsl(var(--chart-${index + 1}))`,
      };
      return acc;
    },
    {} as Record<string, { label: string; color: string }>,
  );
  return (
    <div className="relative h-[375px] w-full">
      {loading ? (
        <div className="flex h-full items-center justify-center">
          <Loader2 className="animate-spin text-gray-500" size={48} />
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 20,
                bottom: 0,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              {Object.keys(chartConfig).map((provider, index) => (
                <Area
                  key={provider}
                  dataKey={provider}
                  type="natural"
                  fill={chartConfig[provider].color}
                  fillOpacity={0.4}
                  stroke={chartConfig[provider].color}
                  stackId={`stack-${index}`}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}
    </div>
  );
}
