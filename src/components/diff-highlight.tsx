"use client"

import { useMemo } from "react"
import { TableRow, TableCell } from "@/components/ui/table"

interface DiffDetail {
  id: number
  auditId: number
  field: string
  oldValue: string | null
  newValue: string | null
}

function highlightDetailedDifferences(oldStr: string, newStr: string) {
  
  if (!oldStr && !newStr) {
    return {
      old: <span className="text-gray-400 italic">(Vacío)</span>,
      new: <span className="text-gray-400 italic">(Vacío)</span>,
    }
  }

  if (oldStr === newStr) return { old: oldStr, new: newStr }

  if (!oldStr && newStr) {
    return {
      old: <span className="text-gray-400 italic">(Vacío)</span>,
      new: <span className="text-green-500">{newStr}</span>,
    }
  }


  if (oldStr && !newStr) {
    return {
      old: <span className="text-red-500">{oldStr}</span>,
      new: <span className="text-gray-400 italic">(eliminado)</span>,
    }
  }

  // Para números, mantenemos la lógica anterior
  if (!isNaN(Number(oldStr)) && !isNaN(Number(newStr))) {
    const oldNum = Number(oldStr)
    const newNum = Number(newStr)
    return {
      old: <span className={`${oldNum > newNum ? "text-red-500" : "text-orange-500"}`}>{oldStr}</span>,
      new: <span className={`${newNum > oldNum ? "text-green-500" : "text-orange-500"}`}>{newStr}</span>,
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

export function DiffTableRow({ detail }: { detail: DiffDetail }) {
  const highlightedValues = useMemo(
    () => highlightDetailedDifferences(detail.oldValue ?? '', detail.newValue ?? ''),
    [detail.oldValue, detail.newValue],
  )

  return (
    <TableRow key={detail.id}>
      <TableCell className="font-medium">{detail.field}</TableCell>
      <TableCell>{highlightedValues.old}</TableCell>
      <TableCell>{highlightedValues.new}</TableCell>
    </TableRow>
  )
}
