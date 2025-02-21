import { getAudit } from "@/actions/audits-actions"
import { DiffTableRow } from "@/components/diff-highlight"
import { EntityNotFound } from "@/components/entity-not-found"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { formatDate } from "@/lib/utils"
import {
  BookOpen,
  Table as TableIcon,
  CalendarClock,
  FileText,
  User2,
  Pointer,
  Logs
} from "lucide-react"
import { DomainEntityDetails } from "../_components/entity-details/domain-entity-details"
import { ProviderEntityDetails } from "../_components/entity-details/provider-entity-details"
import { ClientEntityDetails } from "../_components/entity-details/client-entity.details"
import { ContactEntityDetails } from "../_components/entity-details/contact-entity-details"
import { UserEntityDetails } from "../_components/entity-details/user-entity-details"
import { AccessEntityDetails } from "../_components/entity-details/access-entity-details"
import { LocalityEntityDetails } from "../_components/entity-details/locality-entity-details"

export default async function AuditDetailsPage({
  params
}: {
  params: { id: number }
}) {
  const auditId = Number(params.id)
  const entityNotFound =
    <EntityNotFound
      icon={<BookOpen className="w-12 h-12 text-gray-400" />}
      title="Auditoría no encontrada"
      description="Lo sentimos, no pudimos encontrar la auditoría que estás buscando. Es posible que la URL proporcionada no sea válida o que la auditoría haya sido eliminada."
      href="/audits"
      linkText="Volver al listado de auditorías"
    />

  if (isNaN(auditId)) {
    return entityNotFound
  }

  const audit = await getAudit(auditId)
  if (!audit) {
    return entityNotFound
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-bold text-2xl"><BookOpen />Auditoría</CardTitle>
        </CardHeader>
        <CardContent className="gap-4 grid grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-2">
            {/* TODO: Avatar del usuario ?  */}
            <User2 className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-sm">Usuario</p>
              <p className="font-medium">{audit.user?.name ?? "Sin usuario"}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <TableIcon className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-sm">Tabla</p>
              <p className="font-medium">{audit.entity}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CalendarClock className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-sm">Fecha de movimiento</p>
              <p className="font-medium">{formatDate(audit.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Pointer className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-sm">Acción</p>
              <p className="font-medium">{audit.action}</p>
            </div>
          </div>
          <div className="gap-4 grid col-span-2 lg:col-span-4">
            <span className="flex items-center gap-2 text-muted-foreground text-sm"><FileText className="w-5 h-5 text-muted-foreground" />Registro</span>
            {
              audit.entityDetails ? (() => {
                switch (audit.entity) {
                  case 'Dominios':
                    return <DomainEntityDetails {...audit} />;
                  case 'Proveedores':
                    return <ProviderEntityDetails {...audit} />
                  case 'Localidades':
                    return <LocalityEntityDetails {...audit} />
                  case 'Contactos':
                    return <ContactEntityDetails {...audit} />
                  case 'Clientes':
                    return <ClientEntityDetails {...audit} />
                  case 'Usuarios':
                    return <UserEntityDetails {...audit} />
                  case 'Accesos':
                    return <AccessEntityDetails {...audit} />
                  default:
                    return <span>Entidad no reconocida</span>;
                }
              })() : <span className="text-gray-400">No encontrado</span>
            }
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-bold text-2xl"><Logs />Detalles del movimiento</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campo</TableHead>
                <TableHead>Valor anterior</TableHead>
                <TableHead>Valor nuevo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                audit.audit_details.map((detail) =>
                  detail.field === "Fecha de vencimiento" || detail.field === "Última modificación" || detail.field === "Fecha de creación" ? (
                    <TableRow key={detail.id}>
                      <TableCell>{detail.field}</TableCell>
                      <TableCell>
                        {detail.oldValue
                          ? formatDate(detail.oldValue)
                          : <span className="text-gray-400 italic">(Vacío)</span>}
                      </TableCell>
                      <TableCell>
                        {formatDate(detail.newValue ? detail.newValue : '--')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    <DiffTableRow key={detail.id} detail={detail} />
                  )
                )
              }
              {/* {
                (() => {
                  switch (audit.entity) {
                    case 'Dominios':
                      return <DomainAuditDetails audit={audit} />;
                    case 'Proveedores':
                      return <ProviderEntityDetails {...audit} />
                    case 'Contactos':
                      return <DomainEntityDetails {...audit} />

                    case 'Clientes':
                      return <ClientEntityDetails {...audit} />
                    case 'Usuarios':
                      return <DomainEntityDetails {...audit} />
                    case 'Accesos':
                      return <DomainEntityDetails {...audit} />
                    default:
                      return <span>Entidad no reconocida</span>;
                  }
                })()
              } */}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}