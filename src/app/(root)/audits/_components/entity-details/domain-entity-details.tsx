import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { statusConfig } from "@/constants";
import { AuditWithRelations } from "@/db/schema";
import { formatDate } from "@/lib/utils";
import { Box, CalendarArrowDown, CalendarArrowUp, Contact2, Globe, Handshake, Mail } from "lucide-react";
import Link from "next/link";

export function DomainEntityDetails(audit: AuditWithRelations) {
  const domainDetails = [
    {
      icon: CalendarArrowUp,
      label: "Fecha de registro",
      value: formatDate(audit.entityDetails && 'createdAt' in audit.entityDetails ? audit.entityDetails.createdAt : "")
    },
    {
      icon: CalendarArrowDown,
      label: "Fecha de vencimiento",
      value: formatDate(audit.entityDetails && 'expirationDate' in audit.entityDetails ? audit.entityDetails.expirationDate : "")
    },
    {
      icon: Handshake,
      label: "Cliente",
      value: audit.entityDetails && 'client' in audit.entityDetails ? (audit.entityDetails.client as { name: string }).name : ""
    },
    {
      icon: Contact2,
      label: "Contacto",
      value: audit.entityDetails && 'contact' in audit.entityDetails ? (audit.entityDetails.contact as { name: string }).name : ""
    },
    {
      icon: Mail,
      label: "Email",
      value: audit.entityDetails && 'contact' in audit.entityDetails ? (audit.entityDetails.contact as { email: string }).email : ""
    },
    {
      icon: Box,
      label: "Proveedor",
      value: audit.entityDetails && 'provider' in audit.entityDetails ? (audit.entityDetails.provider as { name: string }).name : ""
    }
  ]

  return (
    <Link href={`/domains/${audit.entityDetails && 'id' in audit.entityDetails ? audit.entityDetails.id.toString() : "#"}`} className="w-fit">
      <Card className="flex flex-col gap-2 hover:shadow-md transition-all duration-200">
        <CardHeader className="p-3">
          <CardTitle className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4 p-0 text-xs sm:text-base truncate">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-muted-foreground" />
              {audit.entityDetails && 'name' in audit.entityDetails ? audit.entityDetails.name : ""}
            </div>
            {audit.entityDetails && 'status' in audit.entityDetails && (
              <Badge
                variant='outline'
                className={`${statusConfig[audit.entityDetails.status].color}`}
              >
                {audit.entityDetails.status}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-3">
          {domainDetails.map((item, index) => (
            <div key={index} className="flex items-start gap-2">
              <item.icon className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-sm">{item.label}</p>
                <p className="font-medium text-xs">{item.value}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </Link>
  )
}