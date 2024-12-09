"use client"
import { getAudit } from "@/actions/audits-actions"
import { Toaster, toast } from "sonner"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
interface AuditDetail {
  id: number
  auditId: number
  oldValue: string | null
  newValue: string | null
  field: string
}

interface Audit {
  id: number
  createdAt: string
  entityId: string
  entity: string
  userId: string | null
  action: string
  user: {
    name: string | null
  } | null
  audit_details: AuditDetail[]
}
export default function AuditDetailsPage({
  params
}: {
  params: { id: number }
}) {
  const [audit, setAudit] = useState<Audit | undefined>(undefined)
  const fetchAudit = async () => {
    try {
      const aud = await getAudit(params.id)
      setAudit(aud)
    } catch (e) {
      if (e instanceof Error) {
        console.log(e)
        toast.error("Error al obtener proveedor", { description: e.message })
      }
    }
  }

  useEffect(() => {
    fetchAudit()
  }, [])

  return (
    <>
      <Toaster richColors />
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Auditoría</h2>
          </div>
        </div>
        {audit && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="text-md block font-medium text-gray-700"
                >
                  Usuario
                </label>
                <div>{audit.user?.name ?? "Sin usuario"}</div>
              </div>
              <div>
                <label
                  htmlFor="url"
                  className="text-md block font-medium text-gray-700"
                >
                  Entidad
                </label>
                <div>{audit.entity}</div>
              </div>
              <div>
                <label
                  htmlFor="url"
                  className="text-md block font-medium text-gray-700"
                >
                  ID Entidad
                </label>
                <div>{audit.entityId}</div>
              </div>
              <div>
                <label
                  htmlFor="url"
                  className="text-md block font-medium text-gray-700"
                >
                  Fecha de movimiento
                </label>
                <div>
                  {new Date(audit.createdAt as string).toLocaleString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    // second: "2-digit",
                    hour12: false
                  })}
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">
                Detalles de la auditoría
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campo</TableHead>
                    <TableHead>Valor anterior</TableHead>
                    <TableHead>Valor nuevo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {audit.audit_details.length === 0 ? (
                    <TableRow>
                      <TableCell>No hay detalles de la auditoría</TableCell>
                    </TableRow>
                  ) : (
                    audit.audit_details.map((detail) => (
                      <TableRow key={detail.id}>
                        <TableCell>{detail.field}</TableCell>
                        <TableCell>{detail.oldValue}</TableCell>
                        <TableCell>{detail.newValue}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
