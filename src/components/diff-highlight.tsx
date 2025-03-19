"use client"

import { useMemo } from "react"
import { TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { sizeConfig, statusConfig } from "@/constants"
import { formatAuditDate } from "@/lib/utils"

interface DiffDetail {
  id: number
  auditId: number
  field: string
  oldValue: string | null
  newValue: string | null
}

// Renderiza un badge con el color apropiado según el campo y valor
function renderBadge(field: string, value: string): JSX.Element {
  let className = ""

  if (field === "Estado") {
    className = statusConfig[value as keyof typeof statusConfig]?.color || ""
  } else if (field === "Tamaño") {
    className = sizeConfig[value as keyof typeof sizeConfig]?.color || ""
  } else if (field === "Tipo") {
    className = ''
  }

  return <Badge variant='outline' className={className}>{value}</Badge>
}

function highlightDetailedDifferences(field: string, oldStr: string | null, newStr: string | null) {
  // Manejo de valores nulos
  if (!oldStr && !newStr) {
    return {
      old: <span className="text-gray-400 italic">(Vacío)</span>,
      new: <span className="text-gray-400 italic">(Vacío)</span>,
    }
  }

  // Si los valores son iguales, no hay diferencia que resaltar
  if (oldStr === newStr) {
    // Para campos especiales, renderizamos badges
    if (field === "Estado" || field === "Tamaño" || field === "Tipo") {
      return {
        old: oldStr ? renderBadge(field, oldStr) : <span className="text-gray-400 italic">(Vacío)</span>,
        new: newStr ? renderBadge(field, newStr) : <span className="text-gray-400 italic">(Vacío)</span>,
      }
    }
    return { old: oldStr, new: newStr }
  }

  // Caso: valor viejo vacío, nuevo con valor
  if (!oldStr && newStr) {
    if (field === "Estado" || field === "Tamaño" || field === "Tipo") {
      return {
        old: <span className="text-gray-400 italic">(Vacío)</span>,
        new: renderBadge(field, newStr),
      }
    }
    return {
      old: <span className="text-gray-400 italic">(Vacío)</span>,
      new: <span className="text-green-500">{newStr}</span>,
    }
  }

  // Caso: valor viejo con valor, nuevo vacío
  if (oldStr && !newStr) {
    if (field === "Estado" || field === "Tamaño" || field === "Tipo") {
      return {
        old: renderBadge(field, oldStr),
        new: <span className="text-gray-400 italic">(Eliminado)</span>,
      }
    }
    return {
      old: <span className="text-red-500">{oldStr}</span>,
      new: <span className="text-gray-400 italic">(Eliminado)</span>,
    }
  }

  // A partir de aquí, sabemos que oldStr y newStr tienen valores
  if (oldStr && newStr) {
    // Para campos especiales, renderizamos badges con colores diferentes
    if (field === "Estado" || field === "Tamaño" || field === "Tipo") {
      return {
        old: <span className="opacity-70 line-through">{renderBadge(field, oldStr)}</span>,
        new: renderBadge(field, newStr),
      }
    }

    // Para texto, hacemos una comparación detallada
    let commonStart = 0
    while (commonStart < oldStr.length && commonStart < newStr.length && oldStr[commonStart] === newStr[commonStart]) {
      commonStart++
    }

    let commonEnd = 0
    while (
      commonEnd < oldStr.length - commonStart &&
      commonEnd < newStr.length - commonStart &&
      oldStr[oldStr.length - 1 - commonEnd] === newStr[newStr.length - 1 - commonEnd]
    ) {
      commonEnd++
    }

    const oldMiddle = oldStr.slice(commonStart, oldStr.length - commonEnd)
    const newMiddle = newStr.slice(commonStart, newStr.length - commonEnd)
    const commonPrefix = oldStr.slice(0, commonStart)
    const commonSuffix = oldStr.slice(oldStr.length - commonEnd)

    return {
      old: (
        <span>
          {commonPrefix}
          <span className="text-red-500 line-through">{oldMiddle}</span>
          {commonSuffix}
        </span>
      ),
      new: (
        <span>
          {commonPrefix}
          <span className="text-green-500">{newMiddle}</span>
          {commonSuffix}
        </span>
      ),
    }
  }
  return { old: oldStr, new: newStr }
}

export function DiffTableRow({ detail }: { detail: DiffDetail }) {
  // Normalizar el nombre del campo (quitar tildes y convertir a minúsculas)
  const normalizedField = detail.field
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()

  const isDateField =
    normalizedField === "fecha de vencimiento" ||
    normalizedField === "ultima modificacion" ||
    normalizedField === "fecha de creacion"

  // Para campos de fecha, formateamos los valores antes de procesarlos
  const oldValue = isDateField ? formatAuditDate(detail.oldValue ?? '') : detail.oldValue
  const newValue = isDateField ? formatAuditDate(detail.newValue ?? '') : detail.newValue


  const highlightedValues = useMemo(
    () =>
      highlightDetailedDifferences(
        detail.field,
        typeof oldValue === "string" ? oldValue : (detail.oldValue ?? ""),
        typeof newValue === "string" ? newValue : (detail.newValue ?? ""),
      ),
    [detail.field, oldValue, newValue, detail.oldValue, detail.newValue],
  )

  return (
    <TableRow key={detail.id}>
      <TableCell className="font-medium">{detail.field}</TableCell>
      <TableCell>{highlightedValues.old}</TableCell>
      <TableCell>{highlightedValues.new}</TableCell>
    </TableRow>
  )
}

