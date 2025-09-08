import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, Check, OctagonX, Handshake, Plus } from "lucide-react";
import { getDashboardData } from "@/actions/client-actions";
export async function CardWrapper() {
  const dashboardData = await getDashboardData();
  return (
    <div className="gap-4 grid grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-0">
          <CardTitle className="font-medium text-sm">
            Clientes totales
          </CardTitle>
          <Handshake className="w-6 h-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="mt-2 lg:mt-0 font-bold text-3xl md:text-4xl text-center lg:text-start">
            {dashboardData.total}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-0">
          <CardTitle className="font-medium text-sm">Nuevos clientes</CardTitle>
          <div className="flex gap-1">
            <Handshake className="w-6 h-6 text-muted-foreground" />
            <Plus className="w-3 h-3 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-2 lg:mt-0 font-bold text-3xl md:text-4xl text-center lg:text-start">
            {dashboardData.newClientsThisMonth}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-0">
          <CardTitle className="font-medium text-sm">
            Clientes activos
          </CardTitle>
          <Check className="w-6 h-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="mt-2 lg:mt-0 font-bold text-3xl md:text-4xl text-center lg:text-start">
            {dashboardData.active}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-0">
          <CardTitle className="font-medium text-sm">
            Clientes suspendidos
          </CardTitle>
          <OctagonX className="w-6 h-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="mt-2 lg:mt-0 font-bold text-3xl md:text-4xl text-center lg:text-start">
            {dashboardData.suspended}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
