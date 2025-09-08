import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe2, Activity, TrendingUp, AlertCircle, Globe } from "lucide-react";
import { getDashboardData } from "@/actions/domains-actions";
export async function CardWrapper() {
  const dashboardData = await getDashboardData();
  return (
    <div className="gap-4 grid grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-0">
          <CardTitle className="font-medium text-base leading-[18px]">
            Dominios totales
          </CardTitle>
          <Globe className="w-6 h-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="mt-2 lg:mt-0 font-bold text-3xl md:text-4xl text-center lg:text-start">
            {dashboardData.total}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-0">
          <CardTitle className="font-medium text-base leading-[18px]">
            Dominios activos
          </CardTitle>
          <Activity className="w-6 h-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="mt-2 lg:mt-0 font-bold text-3xl md:text-4xl text-center lg:text-start">
            {dashboardData.active}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-0">
          <CardTitle className="font-medium text-base leading-[18px]">
            Dominios vencidos
          </CardTitle>
          <AlertCircle className="w-6 h-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="mt-2 lg:mt-0 font-bold text-3xl md:text-4xl text-center lg:text-start">
            {dashboardData.expired}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-0">
          <CardTitle className="font-medium text-base leading-[18px]">
            Balance mensual
          </CardTitle>
          <TrendingUp className="w-6 h-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="mt-2 lg:mt-0 font-bold text-3xl md:text-4xl text-center lg:text-start">
            {dashboardData.growthPercentage}%
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
