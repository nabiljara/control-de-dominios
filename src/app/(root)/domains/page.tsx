
import { Metadata } from "next"
import { columns } from "./_components/columns"
import { DataTable } from "@/components/data-table"
import { getDomains } from "@/actions/domains-actions"
import { DataTableToolbar } from "./_components/data-table-toolbar"
import { Globe } from "lucide-react"
import { Domain } from "@/db/schema"
import { getProviders } from "@/actions/provider-actions"
import { getClients } from "@/actions/client-actions"

export const metadata: Metadata = {
  title: "Dominios",
}

export default async function DomainPage() {
  let domains: Domain[] = []
  const filterClients: Array<string> = []
  const filterProviders: Array<string> = []

  try {
    domains = await getDomains()
  } catch (error) {
    console.error('Error al buscar los dominios: ', error)
  }

  try {
    const providers = await getProviders();

    providers.map((provider) => {
      const newFilterProvider: string = provider.name
      filterProviders.push(newFilterProvider)
    })
  } catch (error) {
    console.error("Error al cargar las localidades:", error);
  }

  try {
    const clients = await getClients();
    clients.map((client) => {
      const newFilterClient: string =  client.name
      filterClients.push(newFilterClient)
    })
  } catch (error) {
    console.error("Error al cargar las localidades:", error);
  }

  return (
    <>
      <div className="md:flex flex-col flex-1 space-y-8 p-8 h-full">
        <div className="flex justify-between items-center space-y-2">
          <div>
            <h2 className="flex flex-row items-center gap-2 font-bold text-2xl tracking-tight">
              <Globe />
              Dominios
            </h2>
            <p className="text-muted-foreground">
              Listado de todos tus dominios
            </p>
          </div>
        </div>
        <DataTable
          data={domains}
          columns={columns}
          ToolbarComponent={DataTableToolbar}
          from="domains"
          filterClients={filterClients}
          filterProviders={filterProviders} />
      </div>
    </>
  )
}
