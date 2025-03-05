"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AccessWithRelations } from "@/db/schema";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { AtSign, Box, KeySquare, Pencil, Pointer, StickyNote, } from "lucide-react";
import { PasswordCell } from "../../password-cell";
import { DeleteAccessModal } from "@/components/access/delete-access-modal"
import { AccessModal } from "@/components/access-modal";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<AccessWithRelations>[] = [
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
          <AccessModal
            provider={{id:access.providerId ?? undefined, name:access.provider?.name ?? ''}}
            client={{ id: access.clientId ?? undefined, name: access.client?.name ?? '' }}
            pathToRevalidate={`/clients/${access.clientId}`}
            access={access}
            key={access.id}
          >
            <Button
              variant="outline"
              className="gap-3 px-2 lg:px-3 h-8"
            >
              <Pencil className="w-4 h-4" />
            </Button>
          </AccessModal>
          <DeleteAccessModal access={access} />
        </div>
      )
    }
  }
];
