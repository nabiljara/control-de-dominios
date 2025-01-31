
import { Metadata } from "next"
import { columns } from "./_components/columns"
import { DataTable } from "@/components/data-table"
import { getClients } from "@/actions/client-actions"
import { DataTableToolbar } from "./_components/data-table-toolbar"
import { User2, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "Clientes",
}

export default async function ClientsPage() {
  const clients = await getClients()

  return (
    <>
      <div className="md:flex flex-col flex-1 space-y-8 p-8 h-full">
        <div className="flex justify-between items-center space-y-2">
          <div>
            <h2 className="flex flex-row items-center gap-2 font-bold text-2xl tracking-tight">
              <Users/>
              Clientes
            </h2>
            <p className="text-muted-foreground">
              Listado de todos tus clientes
            </p>
          </div>
        </div>
        <DataTable data={clients} columns={columns} ToolbarComponent={DataTableToolbar} from="clients" />
      </div>
    </>
  )
}
