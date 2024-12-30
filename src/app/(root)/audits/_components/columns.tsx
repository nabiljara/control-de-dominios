"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { DataTableRowActions } from "@/components/data-table-row-actions"
import { z } from "zod"
export const auditsSchema = z.object({
  id: z.number(),
  createdAt: z.string(),
  entityId: z.string(),
  entity: z.string(),
  userId: z.string().nullable(),
  action: z.string(),
  user: z
    .object({
      name: z.string().nullable()
    })
    .nullable()
})
type Audit = z.infer<typeof auditsSchema>

export const columns: ColumnDef<Audit>[] = [
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
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    enableSorting: true,
    enableHiding: true
  },
  {
    accessorKey: "userId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Usuario" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.original.user?.name ?? "Sin usuario"}</div>
    ),
    enableSorting: true,
    enableHiding: true
  },
  {
    accessorKey: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Acción" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("action")}</div>,
    enableSorting: true,
    enableHiding: true
  },
  {
    accessorKey: "entity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Entidad" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("entity")}</div>,
    enableSorting: true,
    enableHiding: true
  },
  {
    accessorKey: "entityId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID en entidad" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("entityId")}</div>
    ),
    enableSorting: true,
    enableHiding: true
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de movimiento" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">
        {new Date(row.getValue("createdAt") as string).toLocaleString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          // second: "2-digit",
          hour12: false
        })}
      </div>
    ),
    enableSorting: true,
    enableHiding: true
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Acciones" />
    ),
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        entityEdit={"audits/" + row.getValue("id")}
        canDelete={false}
        canEdit={false}
      />
    )
  }
]
