import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"
import { getAudits } from "@/actions/audits-actions"
import { Toaster } from "sonner"
import * as React from "react"
import { getUsersB } from "@/actions/user-action/user-actions"

export default async function ProvidersPage() {
  const audits = await getAudits()
  const users = await getUsersB()

  return (
    <>
      <Toaster richColors />
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Auditorias</h2>
            <p className="text-muted-foreground">
              Listado de todos las auditorias
            </p>
          </div>
        </div>
        <DataTable data={audits} columns={columns} users={users} />
      </div>
    </>
  )
}
