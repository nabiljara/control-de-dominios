import { Metadata } from "next"
import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"
import { Toaster } from "sonner"
import { getContacts } from "@/actions/contacts-actions"

export const metadata: Metadata = {
  title: "Contactos"
}

export default async function ContactPage() {
  const contacts = await getContacts()
  return (
    <>
      <Toaster richColors />
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Contactos</h2>
            <p className="text-muted-foreground">
              Listado de todos los Contactos
            </p>
          </div>
        </div>
        <DataTable data={contacts} columns={columns} />
      </div>
    </>
  )
}
