"use client"

import { ColumnDef } from "@tanstack/react-table"

import { sizes, statuses } from "@/app/(root)/clients/data/data"

import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { DataTableRowActions } from "@/components/data-table-row-actions"
import { Client } from "@/db/schema"
import { Checkbox } from "@radix-ui/react-checkbox"

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="N°" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("name")}</div>,
    enableSorting: true,
    enableHiding: true
    // filterFn: (row, id, value) => {
    //   return value.includes(row.getValue(id))
    // },
  },
  // {
  //   accessorKey: "title",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Title" />
  //   ),
  //   cell: ({ row }) => {
  //     const label = labels.find((label) => label.value === row.original.label)

  //     return (
  //       <>
  //        {/* <div className="flex space-x-2"> */}
  //         {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
  //         <span className="max-w-[500px] font-medium truncate">
  //           {row.getValue("title")}
  //         </span>
  //       {/* </div> */}
  //       </>
  //     )
  //   },
  // },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
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
      const size = sizes.find(
        (size) => size.value === row.getValue("size")
      )

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
        canEdit
        row={row}
        entityEdit={"clients/" + row.getValue("id")}
        canDelete={true}
      />
    )
  }
]
