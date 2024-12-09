import { promises as fs } from "fs"
import path from "path"
import { Metadata } from "next"
import { z } from "zod"
import db from "@/db"
import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"
import { clientSchema } from "./data/schema"
import { getClients } from "@/actions/client-actions"
import { Client } from "@/db/schema"

export const metadata: Metadata = {
  title: "Clientes",
}

// // Simulate a database read for clients.
// async function getClients() {
//   const data = await fs.readFile(
//     path.join(process.cwd(), "src/app/(root)/clients/data/clients.json")
//   )
//   // const data = db.query.clients.findMany({
//   //   with: {
//   //     access:true
//   //   }
//   // })
//   const clients = JSON.parse(data.toString())
//   // return data;
//   return z.array(clientSchema).parse(clients)
// }

export default async function ClientsPage() {
  const clients = await getClients()
  // const clients: Client[] = [{
  //   id: 11,
  //   localityId: 3,
  //   size: 'Medio',
  //   status: 'Activo',
  //   name: 'Lucca',
  //   createdAt: '2024-12-09 14:10:32.942388',
  //   updatedAt: '2024-12-09 14:10:32.942388'
  // },
  // {
  //   id: 10,
  //   localityId: 4,
  //   size: 'Chico',
  //   status: 'Inactivo',
  //   name: 'NABIL',
  //   createdAt: '2024-12-09 13:32:17.777705',
  //   updatedAt: '2024-12-09 13:32:17.777705'
  // },
  // {
  //   id: 9,
  //   localityId: 3,
  //   size: 'Chico',
  //   status: 'Activo',
  //   name: 'Nabilardoooo',
  //   createdAt: '2024-12-09 13:24:05.474436',
  //   updatedAt: '2024-12-09 13:24:05.474436'
  // },
  // {
  //   id: 8,
  //   localityId: 4,
  //   size: 'Chico',
  //   status: 'Activo',
  //   name: 'Nabilardo',
  //   createdAt: '2024-12-09 13:23:20.113005',
  //   updatedAt: '2024-12-09 13:23:20.113005'
  // }]
  // console.log(clients);
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
