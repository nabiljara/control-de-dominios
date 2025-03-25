import { Suspense } from "react";
import { getRegisteredPerMonthData } from "@/actions/domains-actions";
import { OverviewDomainChart } from "./overview-domain-chart";
import { Loader2 } from "lucide-react";
export async function OverviewDomain() {
  const registeredByMonth = await getRegisteredPerMonthData();
  const formattedData = registeredByMonth
    .map((item) => ({
      month: new Date(item.month as string),
      count: item.count,
    }))
    .sort((a, b) => a.month.getTime() - b.month.getTime());

  const sortedDomainsPerMonth = formattedData.map((item) => ({
    month: item.month.toLocaleDateString("es-ES", {
      month: "2-digit",
      year: "numeric",
    }),
    count: item.count,
  }));

  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center text-center">
          <Loader2 className="animate-spin text-gray-500" size={48} />
        </div>
      }
    >
      <OverviewDomainChart data={sortedDomainsPerMonth} />
    </Suspense>
  );
}
