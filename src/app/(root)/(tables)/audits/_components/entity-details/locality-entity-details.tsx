import { AuditWithRelations } from "@/db/schema";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export function LocalityEntityDetails(audit: AuditWithRelations) {
  return (
      <Card className="flex flex-col gap-2 w-fit">
        <CardHeader className="p-3">
          <CardTitle className="flex md:flex-row items-center gap-4 p-0 text-xl">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            {audit.entityDetails && 'name' in audit.entityDetails ? audit.entityDetails.name : ""}
          </CardTitle>
        </CardHeader>
      </Card>

  )
}