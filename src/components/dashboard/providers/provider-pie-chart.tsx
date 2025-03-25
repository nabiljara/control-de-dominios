"use client";

import * as React from "react";
import { Label, Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  dominios: {
    label: "Dominios",
  },
} satisfies ChartConfig;

export function ProviderPieChart({
  data = [],
}: {
  data: Record<string, string | number>[];
}) {
  const formattedData = data.map((item) => ({
    ...item,
    dominios: Number(item.dominios),
  }));
  const totalDominios = React.useMemo(() => {
    return formattedData.reduce((acc, curr) => acc + curr.dominios, 0);
  }, [formattedData]);
  return (
    <div className="relative flex w-full flex-col">
      <div className="h-[300px] w-full md:h-[350px]">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={formattedData}
                dataKey="dominios"
                nameKey="proveedor"
                innerRadius="50%"
                outerRadius="80%"
                strokeWidth={2}
                labelLine={false}
              >
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
                            className="fill-foreground text-2xl font-bold"
                          >
                            {totalDominios.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 20}
                            className="fill-muted-foreground text-sm"
                          >
                            Dominios
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
