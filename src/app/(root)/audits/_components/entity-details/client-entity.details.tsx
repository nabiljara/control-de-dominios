import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuditWithRelations } from "@/db/schema";
import { Building, MapPin, User } from "lucide-react";
import Link from "next/link";

export function ClientEntityDetails(audit: AuditWithRelations) {
  return (
    <Link href={`/clients/${audit.entityDetails && 'id' in audit.entityDetails ? audit.entityDetails.id.toString() : "#"}`} className="md:w-2/3 lg:w-1/2">
      <Card className="flex flex-col gap-2 hover:shadow-md transition-all duration-200">
        <CardHeader className="p-3">
          <CardTitle className="flex md:flex-row justify-between items-center gap-4 p-0 text-xl">
            <span className="flex items-center gap-2">
              <User className="w-5 h-5 text-muted-foreground" />
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
              icon: MapPin,
              label: "Localidad",
              value: audit.entityDetails && 'locality' in audit.entityDetails ? (audit.entityDetails.locality as { name: string }).name : ""
            },
            {
              icon: Building,
              label: "Tamaño",
              value: audit.entityDetails && 'size' in audit.entityDetails ? audit.entityDetails.size : ""
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