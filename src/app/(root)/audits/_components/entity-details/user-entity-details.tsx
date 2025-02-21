import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuditWithRelations } from "@/db/schema";
import { getInitials } from "@/lib/utils";
import { Mail } from "lucide-react";

export function UserEntityDetails(audit: AuditWithRelations) {
  return (
    <Card className="flex flex-col gap-2 hover:shadow-md w-fit transition-all duration-200">
      <CardHeader className="p-3">
        <CardTitle className="flex md:flex-row justify-between items-center gap-4 p-0 text-xl">
          <span className="flex items-center gap-2">
            <Avatar className="rounded-full w-8 h-8">
              <AvatarFallback>{getInitials(audit.entityDetails && 'name' in audit.entityDetails ? audit.entityDetails.name : "")}</AvatarFallback>
            </Avatar>
            {audit.entityDetails && 'name' in audit.entityDetails ? audit.entityDetails.name : ""}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {[
          {
            icon: Mail,
            label: "Mail",
            value: audit.entityDetails && 'email' in audit.entityDetails ? audit.entityDetails.email : ""
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