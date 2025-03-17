"use client";

import * as React from "react";
import { Label, Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Loader2 } from "lucide-react";

const chartConfig = {
  dominios: {
    label: "Dominios",
  },
  godaddy: {
    label: "GoDaddy",
    color: "hsl(var(--chart-1))",
  },
  donweb: {
    label: "DonWeb",
    color: "hsl(var(--chart-2))",
  },
  google: {
    label: "Google Domains",
    color: "hsl(var(--chart-3))",
  },
  hostinger: {
    label: "Hostinger",
    color: "hsl(var(--chart-4))",
  },
  otros: {
    label: "Otros",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function ProviderOverview({
  data = [],
  loading,
}: {
  data: Record<string, string | number>[];
  loading: boolean;
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
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="animate-spin text-gray-500" size={48} />
          </div>
        ) : (
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
        )}
      </div>
      {!loading && (
        <div className="mt-4 w-full px-2">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {Object.entries(data).map(([key, config]) =>
              config.dominios !== "0" ? (
                <div key={key} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: config.fill as string }}
                  ></div>
                  <span className="text-sm text-muted-foreground">
                    {config.proveedor}
                  </span>
                </div>
              ) : (
                ""
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
