import { promises as fs } from "fs"
import path from "path"
import { Metadata } from "next"
import { z } from "zod"
import db from "@/db"

import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"
import { clientSchema } from "@/app/(root)/clients/data/schema"
import { getDomains } from "@/actions/domains-actions"

export const metadata: Metadata = {
  title: "Dominios",
}

export default async function DomainPage() {
  const domains = await getDomains()
  // console.log(domains);
  
  return (
    <>
      <div className="md:flex flex-col flex-1 space-y-8 hidden p-8 h-full">
        <div className="flex justify-between items-center space-y-2">
          <div>
            <h2 className="font-bold text-2xl tracking-tight">Dominios</h2>
            <p className="text-muted-foreground">
              Listado de todos tus dominios
            </p>
          </div>
        </div>
        <DataTable data={domains} columns={columns} />
      </div>
    </>
  )
}
