import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuditWithRelations } from "@/db/schema";
import { Building, Contact2, Handshake, Mail, MapPin, Phone, User } from "lucide-react";
import Link from "next/link";

export function ContactEntityDetails(audit: AuditWithRelations) {
  return (
    <Link href={`/contacts/${audit.entityDetails && 'id' in audit.entityDetails ? audit.entityDetails.id.toString() : "#"}`} className="w-1/2">
      <Card className="flex flex-col gap-2 hover:shadow-md transition-all duration-200">
        <CardHeader className="p-3">
          <CardTitle className="flex md:flex-row justify-between items-center gap-4 p-0 text-xl">
            <span className="flex items-center gap-2">
              <Contact2 className="w-5 h-5 text-muted-foreground" />
              {audit.entityDetails && 'name' in audit.entityDetails ? audit.entityDetails.name : ""}
            </span>
            {audit.entityDetails && 'status' in audit.entityDetails && (
              <Badge variant='default'>
                {audit.entityDetails.status}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="gap-4 grid grid-cols-2 p-">
          {[
            {
              icon: Mail,
              label: "Mail",
              value: audit.entityDetails && 'email' in audit.entityDetails ? audit.entityDetails.email : "" 
            },
            {
              icon: Phone,
              label: "Teléfono",
              value: audit.entityDetails && 'phone' in audit.entityDetails ? audit.entityDetails.phone : ""
            },
            {
              icon: Handshake,
              label: "Cliente",
              value: audit.entityDetails && 'client' in audit.entityDetails && audit.entityDetails.client !== null ? (audit.entityDetails.client as { name: string }).name : "Sin cliente"
            },
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-2">
              <item.icon className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-sm">{item.label}</p>
                <p className="font-medium">{item.value}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </Link>
  )
}