import { getDashboardData } from "@/actions/provider-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Building2 } from "lucide-react";
export async function CardWrapper() {
  const dashboardData = await getDashboardData();
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
          <CardTitle className="text-base font-medium leading-[18px]">
            Proveedores Totales
          </CardTitle>
          <Building2 className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="mt-2 text-center text-2xl font-bold md:text-4xl lg:mt-0 lg:text-start">
            {dashboardData.total}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
          <CardTitle className="text-base font-medium leading-[18px]">
            Proveedor más utilizado
          </CardTitle>
          <TrendingUp className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="mt-2 text-center text-2xl font-bold md:text-3xl lg:mt-0 lg:text-start">
            {dashboardData.mostUsedProv.providerName}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
