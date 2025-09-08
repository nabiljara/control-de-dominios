import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuditWithRelations } from "@/db/schema";
import { Box, Handshake, User } from "lucide-react";

export function AccessEntityDetails(audit: AuditWithRelations) {
  return (
    <Card className="flex flex-col gap-2 hover:shadow-md w-fit transition-all duration-200">
      <CardHeader className="p-3">
        <CardTitle className="flex md:flex-row justify-between items-center gap-4 p-0 text-xl">
          <span className="flex items-center gap-2">
            <User className="w-5 h-5 text-muted-foreground" />
            {audit.entityDetails && 'username' in audit.entityDetails ? audit.entityDetails.username : ""}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="gap-4 grid grid-cols-2 p-3">
        {[
          {
            icon: Handshake,
            label: "Cliente",
            value: audit.entityDetails && 'client' in audit.entityDetails ? (audit.entityDetails.client as { name: string }).name : ""
          },
          {
            icon: Box,
            label: "Proveedor",
            value: audit.entityDetails && 'provider' in audit.entityDetails ? (audit.entityDetails.provider as { name: string }).name : ""
          }
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
  )
}