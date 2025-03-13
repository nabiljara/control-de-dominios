import { Metadata } from "next"
import { columns } from "./_components/columns"
import { DataTable } from "../../../components/data-table"
import { getContacts } from "@/actions/contacts-actions"
import { DataTableToolbar } from "./_components/data-table-toolbar"
import { Contact2 } from "lucide-react"
import { getActiveClients, getClients } from "@/actions/client-actions"
import { Client, Contact } from "@/db/schema"
import HeaderPage from "@/components/header-page"

export const metadata: Metadata = {
  title: "Contactos"
}

export default async function ContactPage() {
  let contacts: Contact[] = []
  const newFilterClients: Array<string> = []
  let formClients: Client[] = []

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
    <div className="flex flex-col space-y-8 p-8">
      <HeaderPage
        icon={<Contact2 className="shrink-0" />}
        title="Contactos"
        description="Listado de todos tus contactos"
      />
      <DataTable
        data={contacts}
        columns={columns}
        ToolbarComponent={DataTableToolbar}
        from="contacts"
        filterClients={newFilterClients}
        formClients={formClients}
      />
    </div>
  )
}
