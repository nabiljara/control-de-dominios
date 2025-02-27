import { Metadata } from "next"
import { columns } from "./_components/columns"
import { DataTable } from "../../../components/data-table"
import { getContacts } from "@/actions/contacts-actions"
import { DataTableToolbar } from "./_components/data-table-toolbar"
import { Contact2 } from "lucide-react"
import { getActiveClients, getClients } from "@/actions/client-actions"
import { Client, Contact } from "@/db/schema"

export const metadata: Metadata = {
  title: "Contactos"
}

export default async function ContactPage() {
  let contacts: Contact[] = []
  const newFilterClients: Array<string> = []
  let formClients:Client[] = []

  try {
    contacts = await getContacts()
  } catch (error) {
    console.error("Error al buscar los contactos: ", error)
  }

  try {
    const filterClients = await getClients()
    filterClients.map((client) => {
      const newClient: string = client.name
      newFilterClients.push(newClient)
    })
    newFilterClients.push('Sin cliente')
  } catch (error) {
    console.error("Error al buscar los clientes para el filtrado:", error)
  }

  try {
    formClients = await getActiveClients()
  } catch (error) {
    console.error("Error al buscar los clientes activos:", error)
  }

  return (
    <>
      <div className="space-y-8 p-8 h-full">
        <div className="flex justify-between items-center space-y-2">
          <div>
            <h2 className="flex flex-row items-center gap-2 font-bold text-2xl tracking-tight">
              <div className="flex justify-center items-center bg-primary/10 rounded-full w-10 h-10">
                <Contact2 className="w-6 h-6 text-primary" />
              </div>
              Contactos
            </h2>
            <p className="text-muted-foreground">
              Listado de todos los contactos
            </p>
          </div>
        </div>
        <DataTable
          data={contacts}
          columns={columns}
          ToolbarComponent={DataTableToolbar}
          from="contacts" 
          filterClients={newFilterClients}
          formClients={formClients}
          />
      </div>
    </>
  )
}
