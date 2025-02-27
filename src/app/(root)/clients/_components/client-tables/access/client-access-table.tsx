import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  KeySquare,
} from "lucide-react"

import { AccessWithRelations, Provider } from "@/db/schema"
import { CreateAccessModal } from "@/components/create-access-modal"
import { Button } from "@/components/ui/button"
import Plus from "@/components/plus"
import { DataTable } from "@/components/data-table"
import { columns } from "./client-access-columns"
import { DataTableToolbar } from "./client-access-data-table-toolbar"

export function ClientAccessTable({
  access,
  providers,
  client,
  filterProviders
}: {
  access: Omit<AccessWithRelations, 'client'>[];
  providers: Provider[];
  client: { id: number, name: string }
  filterProviders: Array<string> // Los proveedores para realizar el filtrado
}) {

  return (
    <Card>
      <CardHeader className="flex">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <CardTitle className="flex items-center gap-2">
              <div className="flex justify-center items-center bg-primary/10 rounded-full w-10 h-10">
                <KeySquare className="w-6 h-6 text-primary" />
              </div>
              Accesos
            </CardTitle>
            <CardDescription>
              Información de los accesos del cliente
            </CardDescription>
          </div>
          <CreateAccessModal
            providers={providers}
            client={client}
            pathToRevalidate={`/clients/${client.id}`}
          >
            <Button
              variant="default"
              className="gap-3 px-2 lg:px-3 h-8"
            >
              <div className="relative">
                <KeySquare />
                <Plus />
              </div>
              Nuevo acceso
            </Button>
          </CreateAccessModal>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable data={access} columns={columns} ToolbarComponent={DataTableToolbar} filterProviders={filterProviders} />
      </CardContent>
    </Card>
  )
}