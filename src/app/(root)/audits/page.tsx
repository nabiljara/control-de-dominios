import { columns } from "./_components/columns"
import { DataTable } from "@/components/data-table"
import { DataTableToolbar } from "./_components/data-table-toolbar"
import { getAudits } from "@/actions/audits-actions"

export default async function ProvidersPage() {
  const audits = await getAudits()
  
  return (
      <div className="md:flex flex-col flex-1 space-y-8 p-8 h-full">
        <div className="flex justify-between items-center space-y-2">
          <div>
            <h2 className="font-bold text-2xl tracking-tight">Auditorias</h2>
            <p className="text-muted-foreground">
              Listado de auditorias
            </p>
          </div>
        </div>
        <DataTable data={audits} columns={columns} ToolbarComponent={DataTableToolbar} from="audits" />
      </div>
  )
}
