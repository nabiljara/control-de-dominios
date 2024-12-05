"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

//TODO: PASAR COMO PARAMETRO AL COMPONENTE Z.INFER DE ESQUEMA DB
// import { taskSchema } from "../app/(root)/clients/data/schema"
import { Eye, Pencil, Trash } from "lucide-react"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  entityEdit: string
  canDelete: boolean
  canEdit: boolean
}

export function DataTableRowActions<TData>({
  row,
  entityEdit,
  canDelete,
  canEdit
}: DataTableRowActionsProps<TData>) {
  // const task = taskSchema.parse(row.original)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem asChild>
          <Link href={entityEdit}>
            <Eye className="mr-2 h-4 w-4" />
            Ver
          </Link>
        </DropdownMenuItem>
        {canEdit && (
          <DropdownMenuItem>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
        )}

        {/*<DropdownMenuSub>
          <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={task.label}>
              {labels.map((label) => (
                <DropdownMenuRadioItem key={label.value} value={label.value}>
                  {label.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator /> */}
        {canDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Trash className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
