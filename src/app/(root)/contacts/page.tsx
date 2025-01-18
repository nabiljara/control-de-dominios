import { Metadata } from "next"
import { columns } from "./_components/columns"
import { DataTable } from "../../../components/data-table"
import { getContacts } from "@/actions/contacts-actions"
import { DataTableToolbar } from "./_components/data-table-toolbar"

export const metadata: Metadata = {
  title: "Contactos"
}

export default async function ContactPage() {
  const contacts = await getContacts()
  return (
    <>
      <div className="md:flex flex-col flex-1 space-y-8 p-8 h-full">
        <div className="flex justify-between items-center space-y-2">
          <div>
            <h2 className="font-bold text-2xl tracking-tight">Contactos</h2>
            <p className="text-muted-foreground">
              Listado de todos los contactos
            </p>
          </div>
        </div>
        <DataTable data={contacts} columns={columns} ToolbarComponent={DataTableToolbar} />
      </div>
    </>
  )
}
