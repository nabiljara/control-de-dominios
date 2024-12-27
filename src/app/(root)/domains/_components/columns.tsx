"use client"

import { ColumnDef } from "@tanstack/react-table"

import { domainStatus } from "@/app/(root)/clients/data/data"
import { Domain } from "@/db/schema"
import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { DataTableRowActions } from "@/components/data-table-row-actions"

export const columns: ColumnDef<Domain>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="N°" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("name")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "provider",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Proveedor" />
    ),
    cell: ({ row }) => {
      const provider: { id: number; name: string } = row.getValue("provider")
      return (
        <>
          <span className="max-w-[500px] font-medium truncate">
            {provider.name || "Sin proveedor"}
          </span>
        </>
      )
    },
    filterFn: (row, id, value) => {
      const provider: { id: number; name: string } = row.getValue(id)
      return value.includes(provider.id.toString())
    }
  },
  {
    accessorKey: "client",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cliente" />
    ),
    cell: ({ row }) => {
      const client: { id: number; name: string } = row.getValue("client")
      return (
        <>
          <span className="max-w-[500px] font-medium truncate">
            {client.name || "Sin cliente"}
          </span>
        </>
      )
    },
    filterFn: (row, id, value) => {
      const client: { id: number; name: string } = row.getValue(id)
      return value.includes(client.id.toString())
    }
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const status = domainStatus.find(
        (status) => status.value === row.getValue("status")
      )

      if (!status) {
        return null
      }

      return (
        <div className="flex items-center w-[140px]">
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
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Acciones" />
    ),
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row}
      canEdit={false}
      entityEdit={"domains/" + row.getValue("id")}
      canDelete={false}
    />,
  },
]
