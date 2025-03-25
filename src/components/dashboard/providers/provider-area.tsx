import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { ProviderAreaChart } from "./provider-area-chart";
import { getDomainsByProviderAndMonth } from "@/actions/provider-actions";
export async function ProviderArea() {
  const data = await getDomainsByProviderAndMonth();
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center text-center">
          <Loader2 className="animate-spin text-gray-500" size={48} />
        </div>
      }
    >
      <ProviderAreaChart data={data} />
    </Suspense>
  );
}
