import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, TrendingUp } from "lucide-react";
import { ProviderOverview } from "./provider-overview";
import { ProviderAreaChart } from "./provider-area-chart";
import { useEffect, useState } from "react";
import {
  getDashboardData,
  getDomainsByProviderAndMonth,
} from "@/actions/provider-actions";
import { Skeleton } from "../ui/skeleton";

type DomainProviderType = {
  proveedor: string;
  dominios: number;
  fill: string;
};
type DashboardData = {
  total: number;
  domainsPerProvider: DomainProviderType[];
};
export function ProvidersDashboard() {
  const [dashData, setDashData] = useState<DashboardData | null>(null);
  const [domainProv, setDomainProv] = useState<DomainProviderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataArea, setDataArea] = useState<Record<string, string | number>[]>(
    [],
  );

  useEffect(() => {
    async function getDomainData() {
      try {
        const dashboardData: DashboardData = await getDashboardData();
        const dataAreaChart = await getDomainsByProviderAndMonth();
        if (dataAreaChart) {
          setDataArea(dataAreaChart);
        }
        setDomainProv(dashboardData.domainsPerProvider);
        setDashData(dashboardData);
      } catch (error) {
        console.log("Error al obtener los datos :", error);
      } finally {
        setLoading(false);
      }
    }

    getDomainData();
  }, []);
  return (
    <>
      <div className="smd:grid-cols-1 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Proveedores Totales
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashData?.total !== undefined ? (
                dashData.total
              ) : (
                <Skeleton className="h-8 w-10" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Registrados en el sistema.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">---</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+8.5%</div>
            <p className="text-xs text-muted-foreground">------</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
        <div className="col-span-4">
          <ProviderOverview data={domainProv} loading={loading} />
        </div>
        <div className="col-span-4">
          <ProviderAreaChart data={dataArea} loading={loading} />
        </div>
      </div>
    </>
  );
}
