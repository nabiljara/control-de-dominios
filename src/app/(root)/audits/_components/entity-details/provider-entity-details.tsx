import { AuditWithRelations } from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Box, ExternalLink } from "lucide-react";
import Link from "next/link";

export function ProviderEntityDetails(audit: AuditWithRelations) {
  return (
    <Link href={`/providers/${audit.entityDetails && 'id' in audit.entityDetails ? audit.entityDetails.id.toString() : "#"}`} className="hover:shadow-md xl:w-1/3">
      <Card className="flex flex-col gap-2 w-full">
        <CardHeader className="p-3">
          <CardTitle className="flex md:flex-row items-center gap-4 p-0 text-xl">
            <Box className="w-5 h-5 text-muted-foreground" />
            {audit.entityDetails && 'name' in audit.entityDetails ? audit.entityDetails.name : ""}
          </CardTitle>
        </CardHeader>
        <CardContent className="gap-4 grid grid-cols-3 p-3">
          <div className="flex items-start gap-2">
            <ExternalLink className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-sm">URL</p>
              <p className="font-medium">{audit.entityDetails && 'url' in audit.entityDetails ? audit.entityDetails.url : ""}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}