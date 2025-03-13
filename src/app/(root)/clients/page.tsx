
import { Metadata } from "next"
import { columns } from "./_components/columns"
import { DataTable } from "@/components/data-table"
import { getClients } from "@/actions/client-actions"
import { DataTableToolbar } from "./_components/data-table-toolbar"
import { Handshake } from "lucide-react"
import { getLocalities } from "@/actions/locality-actions"
import { Client } from "@/db/schema"
import HeaderPage from "@/components/header-page"

export const metadata: Metadata = {
  title: "Clientes",
}

export default async function ClientsPage() {
  let clients: Client[] = [];
  const newLocalities: Array<string> = [];

  try {
    clients = await getClients();
  } catch (error) {
    console.error("Error al obtener los clientes:", error);
  }

  try {
    const localities = await getLocalities();
    localities.map((locality) => {
      const newLocality: string = locality.name
      newLocalities.push(newLocality)
    });
  } catch (error) {
    console.error("Error al obtener las localidades:", error);
  }

  return (
    <div className="flex flex-col space-y-8 p-8">
      <HeaderPage
        icon={<Handshake className="shrink-0" />}
        title="Clientes"
        description="Listado de todos tus clientes"
      />
      <DataTable
        data={clients}
        columns={columns}
        ToolbarComponent={DataTableToolbar}
        filterLocalities={newLocalities}
        from="clients" />
    </div>
  )
}
