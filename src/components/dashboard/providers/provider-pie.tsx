import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { getDomainsPerProv } from "@/actions/provider-actions";
import { ProviderPieChart } from "./provider-pie-chart";
export async function ProviderPie() {
  const data = await getDomainsPerProv();
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center text-center">
          <Loader2 className="animate-spin text-gray-500" size={48} />
        </div>
      }
    >
      <ProviderPieChart data={data} />
    </Suspense>
  );
}
