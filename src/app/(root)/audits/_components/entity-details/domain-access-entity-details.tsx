import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { statusConfig } from "@/constants";
import {
  AuditWithRelations,
  DomainAccessWithConnectedRelations,
} from "@/db/schema";
import { Box, Handshake, KeySquare, LucideGlobe } from "lucide-react";
import Link from "next/link";

export function DomainAccessEntityDetails(audit: AuditWithRelations) {
  const isDomainAccess = (
    entity: AuditWithRelations["entityDetails"],
  ): entity is DomainAccessWithConnectedRelations => {
    return (
      entity !== null &&
      typeof entity === "object" &&
      "domain" in entity &&
      "access" in entity
    );
  };
  return (
    <>
      <div className="space-x-2 md:flex">
        <Link
          href={
            isDomainAccess(audit.entityDetails)
              ? `/domains/${audit.entityDetails.domain.id}`
              : "#"
          }
          className="w-fit"
        >
          <Card className="flex flex-col gap-2 transition-all duration-200 hover:shadow-md">
            <CardHeader className="p-3">
              <CardTitle className="flex items-center justify-between gap-4 p-0 text-lg md:flex-row md:text-xl">
                <span className="flex items-center gap-2">
                  <LucideGlobe className="h-5 w-5 text-muted-foreground" />
                  {isDomainAccess(audit.entityDetails)
                    ? audit.entityDetails.domain.name
                    : "No disponible"}
                </span>
                {isDomainAccess(audit.entityDetails) ? (
                  <Badge
                    variant="outline"
                    className={`${statusConfig[audit.entityDetails.domain.status].color}`}
                  >
                    {audit.entityDetails.domain.status}
                  </Badge>
                ) : (
                  "No disponible"
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p- grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                {
                  icon: Handshake,
                  label: "Cliente",
                  value: isDomainAccess(audit.entityDetails)
                    ? audit.entityDetails.domain.client?.name
                    : "No disponible",
                },
                {
                  icon: Box,
                  label: "Proveedor",
                  value: isDomainAccess(audit.entityDetails)
                    ? audit.entityDetails.domain.provider?.name
                    : "No disponible",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground md:text-sm">
                      {item.label}
                    </p>
                    <p className="text-sm font-medium md:text-[16px]">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </Link>
        <Link
          href={
            isDomainAccess(audit.entityDetails)
              ? `/clients/${audit.entityDetails.access.clientId}`
              : "#"
          }
          className="w-fit"
        >
          <Card className="flex flex-col gap-2 transition-all duration-200 hover:shadow-md">
            <CardHeader className="p-3">
              <CardTitle className="flex items-center justify-between gap-4 p-0 text-lg md:flex-row md:text-xl">
                <span className="flex items-center gap-2">
                  <KeySquare className="h-5 w-5 text-muted-foreground" />
                  {isDomainAccess(audit.entityDetails)
                    ? audit.entityDetails.access.username
                    : "No disponible"}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p- grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                {
                  icon: Handshake,
                  label: "Cliente",
                  value: isDomainAccess(audit.entityDetails)
                    ? audit.entityDetails?.access.client.name
                    : "No disponible",
                },
                {
                  icon: Box,
                  label: "Proveedor",
                  value: isDomainAccess(audit.entityDetails)
                    ? audit.entityDetails?.access.provider?.name
                    : "No disponible",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground md:text-sm">
                      {item.label}
                    </p>
                    <p className="text-sm font-medium md:text-[16px]">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}{" "}
            </CardContent>
          </Card>
        </Link>
      </div>
    </>
  );
}
