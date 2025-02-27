import { columns } from "./_components/columns"
import { DataTable } from "@/components/data-table"
import { DataTableToolbar } from "./_components/data-table-toolbar"
import { getAudits } from "@/actions/audits-actions"
import { Audit } from "@/db/schema"

import { getUsers } from "@/actions/user-action/user-actions"

export default async function ProvidersPage() {
  let audits: Audit[] = []
  const filterUsers: Array<string> = []

  try {
    audits = await getAudits()
  } catch (error) {
    console.error('Error al buscar las auditorías: ', error);
  }

  try {
    const users = await getUsers()
    users.map((user) => {
      const newFilterUser: string = user.name
      filterUsers.push(newFilterUser)
    })
    filterUsers.push('Sin usuario')
  } catch (error) {
    console.error("Error al obtener los usuarios:", error)
  }

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
      <DataTable
        data={audits}
        columns={columns}
        ToolbarComponent={DataTableToolbar}
        filterUsers={filterUsers}
        from="audits"
      />
    </div>
  )
}
