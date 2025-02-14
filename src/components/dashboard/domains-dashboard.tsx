import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe2, Activity, TrendingUp, CircleAlert, Minus } from "lucide-react";
import { OverviewDomain } from "./overview-domain";
import { ExpiringDomains } from "./expiring-domains";
import { useEffect, useState } from "react";
import {
  getDashboardData,
  getExpiringDomains,
} from "@/actions/domains-actions";
import { Skeleton } from "../ui/skeleton";
import { DomainWithRelations } from "@/db/schema";
type DashboardData = {
  total: number;
  active: number;
  expired: number;
  registeredPerMonth: { month: unknown; count: number }[];
  growthPercentage: number;
};

export function DomainsDashboard() {
  const [dashData, setDashData] = useState<DashboardData | null>(null);
  const [expiringDomains, setExpiringDomains] = useState<
    Omit<DomainWithRelations, "contact" | "accessData" | "history">[]
  >([]);
  const [registeredByMonth, setRegisteredByMonth] = useState<
    { month: string; count: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getDomainData() {
      try {
        const dashboardData: DashboardData = await getDashboardData();
        const { expiredDomains } = await getExpiringDomains();
        const formattedData = dashboardData.registeredPerMonth
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
        setExpiringDomains(expiredDomains);
        setRegisteredByMonth(sortedDomainsPerMonth);
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Dominios Totales
            </CardTitle>
            <Globe2 className="h-4 w-4 text-muted-foreground" />
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
              {/* TODO: SACAR PORCENTAJE */}
              +180.1% desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Dominios Activos
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashData?.active !== undefined ? (
                dashData.active
              ) : (
                <Skeleton className="h-8 w-10" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {/* TODO: SACAR DIFF CANTIDAD */}
              +201 desde la última semana
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Dominios Vencidos
            </CardTitle>
            <Minus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashData?.expired !== undefined ? (
                dashData.expired
              ) : (
                <Skeleton className="h-8 w-10" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {/* TODO: SACAR DIFF */}
              +20 nuevos este mes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Crecimiento Mensual
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {/* TODO: HACER PRUEBAS */}
              {dashData?.growthPercentage !== undefined ? (
                dashData.growthPercentage + "%"
              ) : (
                <Skeleton className="h-8 w-10" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {/* TODO: COMPARAR CON MES PASADO */}
              +2.1% desde el mes pasado
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Dominios por Mes</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewDomain data={registeredByMonth} loading={loading} />
          </CardContent>
        </Card>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex flex-row items-center gap-1 text-2xl">
              <CircleAlert className="mt-1 text-orange-600" />
              Dominios proximos a Vencer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ExpiringDomains domains={expiringDomains} loading={loading} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
