import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleAlert } from "lucide-react";
import { OverviewDomain } from "../domains/overview-domain";
import { ExpiringDomains } from "./expiring-domains";
import { CardWrapper } from "./card-wrapper";
import { Suspense } from "react";
import { SkeletonCardWrapper } from "../skeleton-card-wrapper";
import { SkeletonTable } from "../skeleton-table";
export function DomainsDashboard() {
  return (
    <>
      <Suspense fallback={<SkeletonCardWrapper />}>
        <CardWrapper />
      </Suspense>
      <div className="gap-4 md:grid md:grid-cols-2 lg:grid-cols-8">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg md:text-2xl">
              Dominios por Mes
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewDomain />
          </CardContent>
        </Card>
        <Card className="mt-4 md:col-span-4 md:mt-0">
          <CardHeader>
            <CardTitle className="flex flex-row items-center gap-1 text-lg md:text-2xl">
              <CircleAlert className="h-6 w-6 text-orange-600 md:mt-1" />
              Dominios proximos a Vencer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<SkeletonTable />}>
              <ExpiringDomains />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
