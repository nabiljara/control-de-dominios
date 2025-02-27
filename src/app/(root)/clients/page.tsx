
import { Metadata } from "next"
import { columns } from "./_components/columns"
import { DataTable } from "@/components/data-table"
import { getClients } from "@/actions/client-actions"
import { DataTableToolbar } from "./_components/data-table-toolbar"
import { Handshake } from "lucide-react"
import { getLocalities } from "@/actions/locality-actions"
import { Client } from "@/db/schema"

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
    <>
      <div className="md:flex flex-col flex-1 space-y-8 p-8 h-full">
        <div className="flex justify-between items-center space-y-2">
          <div>
            <h2 className="flex flex-row items-center gap-2 font-bold text-2xl tracking-tight">
              <div className="flex justify-center items-center bg-primary/10 rounded-full w-10 h-10">
                <Handshake className="w-6 h-6 text-primary" />
              </div>
              Clientes
            </h2>
            <p className="text-muted-foreground">
              Listado de todos tus clientes
            </p>
          </div>
        </div>
        <DataTable
          data={clients}
          columns={columns}
          ToolbarComponent={DataTableToolbar}
          filterLocalities={newLocalities}
          from="clients" />
      </div>
    </>
  )
}
