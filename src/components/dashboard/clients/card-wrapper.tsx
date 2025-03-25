import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, Check, OctagonX } from "lucide-react";
import { getDashboardData } from "@/actions/client-actions";
export async function CardWrapper() {
  const dashboardData = await getDashboardData();
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
          <CardTitle className="text-sm font-medium">
            Clientes Totales
          </CardTitle>
          <Users className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="mt-2 text-center text-3xl font-bold md:text-4xl lg:mt-0 lg:text-start">
            {dashboardData.total}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
          <CardTitle className="text-sm font-medium">Nuevos Clientes</CardTitle>
          <UserPlus className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="mt-2 text-center text-3xl font-bold md:text-4xl lg:mt-0 lg:text-start">
            {dashboardData.newClientsThisMonth}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
          <CardTitle className="text-sm font-medium">
            Clientes activos
          </CardTitle>
          <Check className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="mt-2 text-center text-3xl font-bold md:text-4xl lg:mt-0 lg:text-start">
            {dashboardData.active}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
          <CardTitle className="text-sm font-medium">
            Clientes suspendidos
          </CardTitle>
          <OctagonX className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="mt-2 text-center text-3xl font-bold md:text-4xl lg:mt-0 lg:text-start">
            {dashboardData.suspended}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
