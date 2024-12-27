import { Metadata } from "next"
import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"
import { getProviders } from "@/actions/provider-actions"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: "Proveedores"
}

export default async function ProvidersPage() {
  const providers = await getProviders()

  return (
    <>
      <Toaster richColors />
      <div className="md:flex flex-col flex-1 space-y-8 hidden p-8 h-full">
        <div className="flex justify-between items-center space-y-2">
          <div>
            <h2 className="font-bold text-2xl tracking-tight">Proveedores</h2>
            <p className="text-muted-foreground">
              Listado de todos los proveedores
            </p>
          </div>
        </div>
        <DataTable data={providers} columns={columns} />
      </div>
    </>
  )
}
