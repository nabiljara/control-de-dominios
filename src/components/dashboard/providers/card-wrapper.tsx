import { getDashboardData } from "@/actions/provider-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Building2, Box } from "lucide-react";
export async function CardWrapper() {
  const dashboardData = await getDashboardData();
  return (
    <div className="gap-4 grid grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-0">
          <CardTitle className="font-medium text-base leading-[18px]">
            Proveedores totales
          </CardTitle>
          <Box className="w-6 h-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="mt-2 lg:mt-0 font-bold text-2xl md:text-4xl text-center lg:text-start">
            {dashboardData.total}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-0">
          <CardTitle className="font-medium text-base leading-[18px]">
            Proveedor más utilizado
          </CardTitle>
          <TrendingUp className="w-6 h-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="mt-2 lg:mt-0 font-bold text-2xl md:text-3xl text-center lg:text-start">
            {dashboardData.mostUsedProv.providerName}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
