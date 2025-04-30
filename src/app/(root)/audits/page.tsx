import { columns } from "./_components/columns"
import { DataTable } from "@/components/data-table"
import { DataTableToolbar } from "./_components/data-table-toolbar"
import { getAudits } from "@/actions/audits-actions"
import { Audit } from "@/db/schema"

import { getUsers } from "@/actions/user-action/user-actions"
import HeaderPage from "@/components/header-page"
import { BookOpen } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "SICOM - Auditorías",
}

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
    <div className="flex flex-col space-y-8 p-8">
      <HeaderPage
        icon={<BookOpen className="shrink-0" />}
        title="Auditorías"
        description="Listado de todos las auditorías"
      />
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
