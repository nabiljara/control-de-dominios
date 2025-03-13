import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {Contact2 } from "lucide-react"
import { ContactModal } from "@/components/contact-modal"
import { Contact } from '@/db/schema'
import { Button } from "@/components/ui/button"
import Plus from "@/components/plus"
import { DataTable } from "@/components/data-table"
import { columns } from './client-contacts-columns'
import { DataTableToolbar } from "./client-contacts-data-table-toolbar"

interface ContactsTableProps {
  contacts: Contact[]
  client: { id: number; name: string; }
}

export function ClientContactsTable({ contacts, client }: ContactsTableProps) {

  return (
    <Card>
      <CardHeader className="flex">
        <div className="flex sm:flex-row flex-col justify-between items-start gap-3 overflow-hidden">
          <div className="flex flex-col gap-2">
            <CardTitle className="flex items-center gap-2">
              <div className="flex justify-center items-center bg-primary/10 rounded-full w-10 h-10">
                <Contact2 className="w-6 h-6 text-primary" />
              </div>
              Contactos
            </CardTitle>
            <CardDescription>
              Información de los contactos del cliente
            </CardDescription>
          </div>

          <ContactModal
            client={client}
            pathToRevalidate={`/clients/${client.id}`}
          >
            <Button
              variant="default"
              className="gap-3 px-2 lg:px-3 h-8"
            >
              <div className="relative">
                <Contact2 />
                <Plus />
              </div>
              Nuevo contacto
            </Button>
          </ContactModal>

        </div>
      </CardHeader>
      <CardContent>
        <DataTable data={contacts} columns={columns} ToolbarComponent={DataTableToolbar} from="contacts" />
      </CardContent>
    </Card>
  )
}
