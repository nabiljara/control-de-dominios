"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Access, AccessWithRelations } from "@/db/schema";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { AtSign, Box, KeySquare, Pointer, StickyNote, } from "lucide-react";
import { PasswordCell } from "../../password-cell";
import { DeleteAccessModal } from "@/components/access/delete-access-modal"
import { CreateAccessModal } from "@/components/create-access-modal";

export const columns: ColumnDef<Omit<AccessWithRelations, "client">>[] = [
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
    accessorKey: "provider",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Proveedor" icon={<Box className="w-4 h-4" />} />
    ),
    cell: ({ row }) => {
      const provider: { id: number; name: string } = row.getValue("provider");
      return (
        <>
          <span className="max-w-[500px] font-medium truncate">
            {provider.name || "Sin proveedor"}
          </span>
        </>
      );
    },
    filterFn: (row, id, value) => {
      const provider: { id: number; name: string } = row.getValue(id);
      return value.includes(provider.name);
    },
    enableSorting: false,
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Usuario / Email" icon={<AtSign className="w-4 h-4" />} />
    ),
    cell: ({ row }) => <span>{row.getValue("username")}</span>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "password",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contraseña" icon={<KeySquare className="w-4 h-4" />} />
    ),
    cell: ({ row }) => <PasswordCell password={row.getValue('password')} show={row.getValue('password') === 'Contraseña mal generada'} />,
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "notes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Notas" icon={<StickyNote className="w-4 h-4" />} />
    ),
    cell: ({ row }) => <span>{row.getValue("notes") !== '' ? row.getValue("notes") : '-'}</span>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: "actions",
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Acciones" icon={<Pointer className="w-4 h-4" />} />
    ),
    cell: ({ row }) => {
      const access = row.original

      return (
      <div className="flex items-center gap-2">
        <DeleteAccessModal access={access} />
        {/* <CreateAccessModal /> */}
      </div>
      )
    }
  }
];
