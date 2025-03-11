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
        // setExpiringDomains(expiredDomains);
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
      <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Dominios Totales
            </CardTitle>
            <Globe2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {dashData?.total !== undefined ? (
                dashData.total
              ) : (
                <Skeleton className="w-10 h-8" />
              )}
            </div>
            <p className="text-muted-foreground text-xs">
              {/* TODO: SACAR PORCENTAJE */}
              +180.1% desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Dominios Activos
            </CardTitle>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {dashData?.active !== undefined ? (
                dashData.active
              ) : (
                <Skeleton className="w-10 h-8" />
              )}
            </div>
            <p className="text-muted-foreground text-xs">
              {/* TODO: SACAR DIFF CANTIDAD */}
              +201 desde la última semana
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Dominios Vencidos
            </CardTitle>
            <Minus className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {dashData?.expired !== undefined ? (
                dashData.expired
              ) : (
                <Skeleton className="w-10 h-8" />
              )}
            </div>
            <p className="text-muted-foreground text-xs">
              {/* TODO: SACAR DIFF */}
              +20 nuevos este mes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Crecimiento Mensual
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {/* TODO: HACER PRUEBAS */}
              {dashData?.growthPercentage !== undefined ? (
                dashData.growthPercentage + "%"
              ) : (
                <Skeleton className="w-10 h-8" />
              )}
            </div>
            <p className="text-muted-foreground text-xs">
              {/* TODO: COMPARAR CON MES PASADO */}
              +2.1% desde el mes pasado
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-8">
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
