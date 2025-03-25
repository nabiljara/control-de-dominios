import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentClients } from "../clients/recent-clients";
import { Suspense } from "react";
import { OverviewClients } from "./overview-clients";
import { SkeletonCardWrapper } from "../skeleton-card-wrapper";
import { CardWrapper } from "./card-wrapper";
import { SkeletonTable } from "../skeleton-table";

export function ClientsDashboard() {
  return (
    <>
      <Suspense fallback={<SkeletonCardWrapper />}>
        <CardWrapper />
      </Suspense>
      <div className="gap-4 md:grid md:grid-cols-2 lg:grid-cols-8">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg md:text-2xl">
              Clientes registrados por Mes
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewClients />
          </CardContent>
        </Card>
        <Card className="mt-4 md:col-span-4 md:mt-0">
          <CardHeader>
            <CardTitle className="text-lg md:text-2xl">
              Últimos Clientes añadidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<SkeletonTable />}>
              <RecentClients />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
