"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { Client } from "@/db/schema"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { clientSizes, clientStatus, sizeConfig, statusConfig } from "@/constants"
import { BarChart2, CalendarArrowUpIcon, CheckCircle, Handshake, MapPin } from "lucide-react"

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="N°" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    enableSorting: true,
    enableHiding: true
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" icon={<Handshake />} />
    ),
    cell: ({ row }) => <span>{row.getValue("name")}</span>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "locality",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Localidad" icon={<MapPin className="w-4 h-4" />} />
    ),
    cell: ({ row }) => {
      const locality: { id: number; name: string } = row.getValue("locality")
      return (
        <span className="font-medium truncate">
          {locality.name || "Sin localidad"}
        </span>
      )
    },
    filterFn: (row, id, value) => {
      const locality: { id: number; name: string } = row.getValue(id)
      return value.includes(locality.name)
    },
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" icon={<CheckCircle className="w-4 h-4" />} />
    ),
    cell: ({ row }) => {
      const status = clientStatus.find(
        (status) => status === row.getValue("status")
      )
      if (!status) {
        return null
      }

      return (
        <Badge
          variant='outline'
          className={statusConfig[row.getValue("status") as keyof typeof statusConfig].color}
        >
          {status}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
  },
  {
    accessorKey: "size",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tamaño" icon={<BarChart2 className="w-4 h-4" />} />
    ),
    cell: ({ row }) => {
      const size = clientSizes.find((size) => size === row.getValue("size"))

      if (!size) {
        return null
      }

      return (
        <div className="flex items-center">
          <Badge
            className={sizeConfig[size as keyof typeof sizeConfig].color}
          >
            {size}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de registro" icon={<CalendarArrowUpIcon className="w-4 h-4" />} />
    ),
    cell: ({ row }) => (
      <div>
        {formatDate(row.getValue("createdAt"))}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  }
]
