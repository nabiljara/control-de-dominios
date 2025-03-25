import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";
import { CardWrapper } from "./card-wrapper";
import { SkeletonCardWrapper } from "../skeleton-card-wrapper";
import { ProviderArea } from "./provider-area";
import { ProviderPie } from "./provider-pie";

export function ProvidersDashboard() {
  return (
    <>
      <Suspense fallback={<SkeletonCardWrapper />}>
        <CardWrapper />
      </Suspense>
      <div className="gap-4 md:grid md:grid-cols-2 lg:grid-cols-8">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg md:text-2xl">
              Dominios por Proveedor
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Distribución actual (todos los dominios).
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ProviderPie />
          </CardContent>
        </Card>
        <Card className="mt-4 md:col-span-4 md:mt-0">
          <CardHeader>
            <CardTitle className="text-lg md:text-2xl">
              Registros de Dominios por Proveedor
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProviderArea />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
