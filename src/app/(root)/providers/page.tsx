import { promises as fs } from "fs"
import path from "path"
import { Metadata } from "next"
import { z } from "zod"
import db from "@/db"

import { columns } from "@/app/(root)/clients/_components/columns"
import { DataTable } from "@/app/(root)/clients/_components/data-table"
import { clientSchema } from "@/app/(root)/clients/data/schema"

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
}

// Simulate a database read for tasks.
async function getTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), "src/app/(root)/clients/data/clients.json")
  )
  const tasks = JSON.parse(data.toString())

  return z.array(clientSchema).parse(tasks)
}

export default async function ProvidersPage() {
  const tasks = await getTasks()

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Provedores</h2>
            <p className="text-muted-foreground">
              Listado de todos tus provedores
            </p>
          </div>
        </div>
        <DataTable data={tasks} columns={columns} />
      </div>
    </>
  )
}
