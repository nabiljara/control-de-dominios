"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { DataTableRowActions } from "@/components/data-table-row-actions"
import { z } from "zod"
export const contactSchema = z.object({
  id: z.number(),
  clientId: z.number().nullable(),
  email: z.string().email({ message: "Debe ser un correo electrónico válido" }),
  name: z
    .string()
    .min(1, { message: "El nombre es obligatorio" })
    .max(255, { message: "El nombre no puede superar los 255 caracteres" }),
  phone: z
    .string()
    .min(1, { message: "El teléfono es obligatorio" })
    .max(255, { message: "El teléfono no puede superar los 255 caracteres" }),
  type: z.enum(["technical", "administrative", "financial"]).nullable(),
  status: z.enum(["active", "inactive"]).nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  client: z
    .object({
      name: z
        .string()
        .min(1, { message: "El nombre es obligatorio" })
        .max(255, { message: "El nombre no puede superar los 255 caracteres" })
    })
    .nullable()
})
type Contact = z.infer<typeof contactSchema>

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
