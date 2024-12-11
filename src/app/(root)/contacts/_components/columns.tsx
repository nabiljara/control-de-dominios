"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { DataTableRowActions } from "@/components/data-table-row-actions"
import { z } from "zod"
import { contactSchema } from "@/validators/client-validator"

const extendedContactSchema = contactSchema.extend({
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  clientId: z.number().nullable().nullable(),
  phone: z
    .string()
    .min(11, { message: "El número no es válido." })
    .max(14, { message: "El número no es válido." })
    .nullable(),
  client: z
    .object({
      id: z.number().optional(),
      name: z
        .string()
        .min(1, { message: "El nombre es obligatorio" })
        .max(255, { message: "El nombre no puede superar los 255 caracteres" })
    })
    .nullable()
})
type Contact = z.infer<typeof extendedContactSchema>

export const columns: ColumnDef<Contact>[] = [
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("name")}</div>,
    enableSorting: true,
    enableHiding: true
  },
  // {
  //   accessorKey: "email",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Email" />
  //   ),
  //   cell: ({ row }) => <div className="w-[80px]">{row.getValue("email")}</div>,
  //   enableSorting: true,
  //   enableHiding: true
  // },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Teléfono" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("phone")}</div>,
    enableSorting: true,
    enableHiding: true
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("status")}</div>,
    enableSorting: true,
    enableHiding: true
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("type")}</div>,
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
        entityEdit={"contacts/" + row.getValue("id")}
        canDelete={false}
        canEdit={false}
      />
    )
  }
]
