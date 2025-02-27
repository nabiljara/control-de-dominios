"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { Client, Contact } from "@/db/schema"
import { CircleCheckBig, Handshake, Mail, Phone, Tag, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { statusConfig } from "@/constants"

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
      <DataTableColumnHeader column={column} title="Nombre" icon={<User />} />
    ),
    cell: ({ row }) => <div className="w-fit font-bold truncate">{row.getValue("name")}</div>,
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
      <DataTableColumnHeader column={column} title="Email" icon={<Mail />} />
    ),
    cell: ({ row }) => <div className="max-w-fit">{row.getValue("email")}</div>,
    enableSorting: true,
    enableHiding: true
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Teléfono" icon={<Phone className="w-4 h-4" />} />
    ),
    cell: ({ row }) => <div className="w-fit">{row.getValue("phone")}</div>,
    enableSorting: false,
    enableHiding: true
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" icon={<CircleCheckBig />} />
    ),
    cell: ({ row }) =>
      <Badge
        variant='outline'
        className={statusConfig[row.getValue("status") as keyof typeof statusConfig].color}
      >
        {row.getValue("status")}
      </Badge>,
    enableSorting: true,
    enableHiding: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    }
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" icon={<Tag />} />
    ),
    cell: ({ row }) =>
      <span className="inline-flex items-center px-2.5 py-0.5 border rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-semibold text-xs transition-colors">
        {row.getValue('type')}
      </span>
    ,
    enableSorting: true,
    enableHiding: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    }
  },
  {
    accessorKey: "client",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cliente" icon={<Handshake />} />
    ),
    cell: ({ row }) => {
      const client: Client = row.getValue("client")
      if (client) {
        return (
          <div className="w-fit font-medium truncate">
            {client.name}
          </div>
        )
      }
      return (
        <span className="w-fit font-medium text-destructive truncate">
          Sin cliente
        </span>
      )
    },
    filterFn: (row, id, value) => {
      const client: { id: number; name: string } = row.getValue(id)
      if (client) {
        return value.includes(client.name)
      } else {
        return value.includes('Sin cliente')
      }
    }
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
