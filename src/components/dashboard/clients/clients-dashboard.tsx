import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, TrendingUp, Check } from "lucide-react";
import { OverviewDomain } from "../domains/overview-domain";
import { RecentClients } from "../clients/recent-clients";
import { useEffect, useState } from "react";
import { getDashboardData, getLatestClients } from "@/actions/client-actions";
import { Skeleton } from "../../ui/skeleton";
import { OverviewClients } from "./overview-clients";
type DashboardData = {
  total: number;
  active: number;
  newClientsThisMonth: number;
  registeredPerMonth: { month: unknown; count: number }[];
  variationPercentage: number;
};
type ClientData = {
  id: number;
  name: string;
  size: "Chico" | "Mediano" | "Grande";
  domainCount: number;
  createdAt: string;
};

export function ClientsDashboard() {
  const [dashData, setDashData] = useState<DashboardData | null>(null);
  const [registeredByMonth, setRegisteredByMonth] = useState<
    { month: string; count: number }[]
  >([]);
  const [latestClients, setLatestClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getClientsData() {
      try {
        const dashboardData: DashboardData = await getDashboardData();
        const clients = await getLatestClients();
        const formattedData = dashboardData.registeredPerMonth
          .map((item) => ({
            month: new Date(item.month as string),
            count: item.count,
          }))
          .sort((a, b) => a.month.getTime() - b.month.getTime());
        const sortedClientsPerMonth = formattedData.map((item) => ({
          month: item.month.toLocaleDateString("es-ES", {
            month: "2-digit",
            year: "numeric",
          }),
          count: item.count,
        }));
        setLatestClients(clients);
        setRegisteredByMonth(sortedClientsPerMonth);
        setDashData(dashboardData);
      } catch (error) {
        console.log("Error al obtener los datos :", error);
      } finally {
        setLoading(false);
      }
    }
    getClientsData();
  }, []);
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-sm font-medium">
              Clientes Totales
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
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
              {dashData?.total !== undefined ? (
                dashData?.newClientsThisMonth >= 0 ? (
                  "+" + dashData?.newClientsThisMonth + " desde el mes pasado."
                ) : (
                  "-" + dashData?.newClientsThisMonth + " desde el mes pasado."
                )
              ) : (
                <Skeleton className="h-3 w-10" />
              )}
              {/* TODO: SACAR CUENTA EN CASO DE QUE SEAN MENOS (restar clientes hasta mes pasado y restar con el actual) */}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-sm font-medium">
              Nuevos Clientes
            </CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashData?.newClientsThisMonth !== undefined ? (
                dashData.newClientsThisMonth
              ) : (
                <Skeleton className="h-8 w-10" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Con respecto al último mes.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-sm font-medium">
              Clientes activos
            </CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {" "}
              {dashData?.active !== undefined ? (
                dashData.active
              ) : (
                <Skeleton className="h-8 w-10" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              +15% desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-sm font-medium">
              Variación de Clientes
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashData?.variationPercentage !== undefined ? (
                dashData.variationPercentage + "%"
              ) : (
                <Skeleton className="h-8 w-10" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Con respecto al último mes
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="gap-4 md:grid md:grid-cols-2 lg:grid-cols-8">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg md:text-2xl">
              Clientes registrados por Mes
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewClients data={registeredByMonth} loading={loading} />
          </CardContent>
        </Card>
        <Card className="mt-4 md:col-span-4 md:mt-0">
          <CardHeader>
            <CardTitle className="text-lg md:text-2xl">
              Últimos Clientes añadidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RecentClients clients={latestClients} loading={loading} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
