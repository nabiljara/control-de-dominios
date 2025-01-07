"use client"

import { Row } from "@tanstack/react-table"
import Link from "next/link"
import { Eye } from "lucide-react"

interface DataTableRowActionsProps {
  href: string
}

export function DataTableRowActions({
  href,
}: DataTableRowActionsProps) {
  return (
    <Link href={href} className="flex justify-center items-center">
      <Eye className="mr-2 w-4 h-4" />
    </Link>
  )
}
