
import { Metadata } from "next"
import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"
import { getClients } from "@/actions/client-actions"

export const metadata: Metadata = {
  title: "Clientes",
}

export default async function ClientsPage() {
  const clients = await getClients()

  return (
    <>
      <div className="md:flex flex-col flex-1 space-y-8 hidden p-8 h-full">
        <div className="flex justify-between items-center space-y-2">
          <div>
            <h2 className="font-bold text-2xl tracking-tight">Clientes</h2>
            <p className="text-muted-foreground">
              Listado de todos tus clientes
            </p>
          </div>
        </div>
        <DataTable data={clients} columns={columns} />
      </div>
    </>
  )
}
