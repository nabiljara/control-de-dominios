
import { Metadata } from "next"
import { columns } from "./_components/columns"
import { DataTable } from "@/components/data-table"
import { getDomains } from "@/actions/domains-actions"
import { DataTableToolbar } from "./_components/data-table-toolbar"
import { Globe } from "lucide-react"
import { Domain } from "@/db/schema"
import { getProviders } from "@/actions/provider-actions"
import { getClients } from "@/actions/client-actions"
import HeaderPage from "@/components/header-page"

export const metadata: Metadata = {
  title: "SICOM - Dominios",
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
      const newFilterClient: string = client.name
      filterClients.push(newFilterClient)
    })
  } catch (error) {
    console.error("Error al cargar las localidades:", error);
  }

  return (
    <div className="flex flex-col space-y-8 p-8">
      <HeaderPage
        icon={<Globe className="shrink-0" />}
        title="Dominios"
        description="Listado de todos tus dominios"
      />
      <DataTable
        data={domains}
        columns={columns}
        ToolbarComponent={DataTableToolbar}
        from="domains"
        filterClients={filterClients}
        filterProviders={filterProviders} />
    </div>
  )
}
