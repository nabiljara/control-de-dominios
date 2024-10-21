"use client"

import { ColumnDef } from "@tanstack/react-table"

import { segments, statuses } from "@/app/(root)/clients/data/data"
import { Client } from "@/app/(root)/clients/data/schema"
import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { DataTableRowActions } from "@/components/data-table-row-actions"

export const columns: ColumnDef<Client>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("name")}</div>,
    enableSorting: true,
    enableHiding: true,
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
  //         <span className="max-w-[500px] truncate font-medium">
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
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
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
    accessorKey: "segment",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Segmento" />
    ),
    cell: ({ row }) => {
      const segment = segments.find(
        (segment) => segment.value === row.getValue("segment")
      )

      if (!segment) {
        return null
      }

      return (
        <div className="flex items-center">
          {segment.icon && (
            <segment.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{segment.label}</span>
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
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
