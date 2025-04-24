import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe2, Activity, TrendingUp, AlertCircle } from "lucide-react";
import { getDashboardData } from "@/actions/domains-actions";
export async function CardWrapper() {
  const dashboardData = await getDashboardData();
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
          <CardTitle className="text-base font-medium leading-[18px]">
            Dominios Totales
          </CardTitle>
          <Globe2 className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="mt-2 text-center text-3xl font-bold md:text-4xl lg:mt-0 lg:text-start">
            {dashboardData.total}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
          <CardTitle className="text-base font-medium leading-[18px]">
            Dominios Activos
          </CardTitle>
          <Activity className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="mt-2 text-center text-3xl font-bold md:text-4xl lg:mt-0 lg:text-start">
            {dashboardData.active}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
          <CardTitle className="text-base font-medium leading-[18px]">
            Dominios Vencidos
          </CardTitle>
          <AlertCircle className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="mt-2 text-center text-3xl font-bold md:text-4xl lg:mt-0 lg:text-start">
            {dashboardData.expired}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
          <CardTitle className="text-base font-medium leading-[18px]">
            Balance Mensual
          </CardTitle>
          <TrendingUp className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="mt-2 text-center text-3xl font-bold md:text-4xl lg:mt-0 lg:text-start">
            {dashboardData.growthPercentage}%
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
