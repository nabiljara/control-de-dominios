"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { DataTableRowActions } from "@/components/data-table-row-actions"
import { Client, Contact } from "@/db/schema"

export const columns: ColumnDef<Contact>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="N°" className="w-8" />
    ),
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
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
    filterFn: (row, id, value) => {
      const locality: { id: number; name: string } = row.getValue(id)
      return value.includes(locality.id.toString())
    }
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
    enableSorting: true,
    enableHiding: true
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Teléfono" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("phone")}</div>,
    enableSorting: false,
    enableHiding: true
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("status")}</div>,
    enableSorting: true,
    enableHiding: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    }
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("type")}</div>,
    enableSorting: true,
    enableHiding: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    }
  },
  {
    accessorKey: "client",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cliente" />
    ),
    cell: ({ row }) => {
      const client: Client = row.getValue("client")
      if (client) {
        return (
          <span className="max-w-[500px] font-medium truncate">
            {client.name}
          </span>
        )
      }
      return (
        <span className="max-w-[500px] font-medium text-destructive truncate">
          Sin cliente
        </span>
      )
    },
    filterFn: (row, id, value) => {
      const client: { id: number; name: string } = row.getValue(id)
      if (client) {
        return value.includes(client.id.toString())
      }else {
        return value.includes('Sin cliente')
      }
    }
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ver" />
    ),
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        href={"contacts/" + row.getValue("id")}
      />
    )
  },
  {
    id: "combinedFilter", // Columna virtual para filtrar por múltiples campos
    filterFn: (row, id, value) => {
      const name = (row.getValue("name") as string)?.toLowerCase() || "";
      const email = (row.getValue("email") as string)?.toLowerCase() || "";
      const search = value.toLowerCase();
      return name.includes(search) || email.includes(search);
    },
  },
]
