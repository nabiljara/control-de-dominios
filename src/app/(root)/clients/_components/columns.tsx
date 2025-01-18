"use client"

import { ColumnDef } from "@tanstack/react-table"

import { sizes, clientStatus } from "@/app/(root)/clients/data/data"

import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { DataTableRowActions } from "@/components/data-table-row-actions"
import { Client } from "@/db/schema"
import { formatDate } from "@/lib/utils"

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
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => <span>{row.getValue("name")}</span>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "locality",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Localidad" />
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
      return value.includes(locality.id.toString())
    },
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const status = clientStatus.find(
        (status) => status.value === row.getValue("status")
      )
      if (!status) {
        return null
      }

      return (
        <div className="flex items-center w-[100px]">
          {status.icon && (
            <status.icon className="mr-2 w-4 h-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
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
      <DataTableColumnHeader column={column} title="Tamaño" />
    ),
    cell: ({ row }) => {
      const size = sizes.find((size) => size.value === row.getValue("size"))

      if (!size) {
        return null
      }

      return (
        <div className="flex items-center">
          {size.icon && (
            <size.icon className="mr-2 w-4 h-4 text-muted-foreground" />
          )}
          <span>{size.label}</span>
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
      <DataTableColumnHeader column={column} title="Fecha de registro" />
    ),
    cell: ({ row }) => (
      <div>
        {formatDate(row.getValue("createdAt"))}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Detalle" />
    ),
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        href={"clients/" + row.getValue("id")}
      />
    )
  }
]
