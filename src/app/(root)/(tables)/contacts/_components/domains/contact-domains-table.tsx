import { DataTable } from "@/components/data-table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { DomainWithRelations } from "@/db/schema"
import {
  Globe,
} from "lucide-react"
import { columns } from "./contact-domains-columns"
import { DataTableToolbar } from "./contact-domains-data-table-toolbar"
import { Button } from "@/components/ui/button"
import Plus from "@/components/plus"
import Link from "next/link"

export async function ContactDomainsTable({
  domains,
  filterProviders,
  filterClients
}: {
  domains: DomainWithRelations[]
  filterProviders?: Array<string>
  filterClients?: Array<string>
}) {
  return (
    <Card>
      <CardHeader className="flex">
        <div className="flex sm:flex-row flex-col justify-between items-start gap-3 overflow-hidden">
          <div className="flex flex-col gap-2">
            <CardTitle className="flex items-center gap-2">
              <div className="flex justify-center items-center bg-primary/10 rounded-full w-10 h-10">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              Dominios
            </CardTitle>
            <CardDescription>
              Información de los dominios del cliente
            </CardDescription>
          </div>
          <Button
            asChild
            className="gap-3 px-2 lg:px-3 h-8"
          >
            <Link href="/domains/create">
              <div className="relative">
                <Globe />
                <Plus />
              </div>
              Nuevo dominio
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable data={domains} columns={columns} ToolbarComponent={DataTableToolbar} from="domains" filterProviders={filterProviders} filterClients={filterClients} />
      </CardContent>
    </Card>
  )
}
