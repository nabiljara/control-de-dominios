"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { Contact } from "@/db/schema"
import { CircleCheckBig, Mail, Phone, Tag, User } from "lucide-react"
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
      <Badge variant='outline' className='truncate'>
        {row.getValue('type')}
      </Badge>
    ,
    enableSorting: true,
    enableHiding: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
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