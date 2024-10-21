import { promises as fs } from "fs"
import path from "path"
import { Metadata } from "next"
import { z } from "zod"
import db from "@/db"
import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"
import { clientSchema } from "./data/schema"

export const metadata: Metadata = {
  title: "Clientes",
  description: "Una tabla de clientes.",
}

// Simulate a database read for clients.
async function getClients() {
  const data = await fs.readFile(
    path.join(process.cwd(), "src/app/(root)/clients/data/clients.json")
  )
  // const data = db.query.clients.findMany({
  //   with: {
  //     access:true
  //   }
  // })
  const clients = JSON.parse(data.toString())
  // return data;
  return z.array(clientSchema).parse(clients)
}

export default async function ClientsPage() {
  const clients = await getClients()
  // console.log(clients[0].access);
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Clientes</h2>
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
