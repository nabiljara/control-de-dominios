"use client"

import { ColumnDef } from "@tanstack/react-table"

import { sizes, clientStatus } from "@/app/(root)/clients/data/data"

import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { DataTableRowActions } from "@/components/data-table-row-actions"
import { Client, ClientWithRelations } from "@/db/schema"
import { Checkbox } from "@radix-ui/react-checkbox"

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
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("name")}</div>,
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
        <>
          {/* <div className="flex space-x-2"> */}
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="max-w-[500px] font-medium truncate">
            {locality.name || "Sin localidad"}
          </span>
          {/* </div> */}
        </>
      )
    },
    filterFn: (row, id, value) => {
      const locality: { id: number; name: string } = row.getValue(id)
      return value.includes(locality.id.toString())
    }
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
    }
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
    }
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Acciones" />
    ),
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        href={"clients/" + row.getValue("id")}
      />
    )
  }
]
