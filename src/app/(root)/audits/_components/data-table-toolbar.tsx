"use client"
import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/data-table-view-options"
import { DataTableFacetedFilter } from "@/components/data-table-faceted-filter"
import { useEffect} from "react"
import { CommandShortcut } from "@/components/ui/command"
import { auditActions, auditEntities } from "@/constants"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filterUsers?: Array<string> // Los usuarios para realizar el filtrado
}

export function DataTableToolbar<TData>({
  table,
  filterUsers
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "f" && (e.metaKey || e.altKey)) {
        e.preventDefault()
        document.getElementById("filter")?.focus()
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <div className="flex lg:flex-row flex-col justify-between items-start lg:items-center gap-2">
      <div className="flex lg:flex-row flex-col flex-1 items-start lg:items-center gap-2 w-full">
        <div className="relative w-2/3 lg:w-[250px]">
          <Input
            id="filter"
            placeholder="Filtrar auditorias por entidad"
            autoFocus
            value={(table.getColumn("entity")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("entity")?.setFilterValue(event.target.value)
            }
            className="h-8"
          />
          <div className="hidden md:block right-2 -bottom-[7px] absolute text-gray-400 -translate-y-1/2">
            <CommandShortcut>⌘F</CommandShortcut>
          </div>
        </div>
        {table.getColumn("entity") && (
          <DataTableFacetedFilter
            column={table.getColumn("entity")}
            title="Entidad"
            options={auditEntities}
          />
        )}
        {table.getColumn("action") && (
          <DataTableFacetedFilter
            column={table.getColumn("action")}
            title="Acción"
            options={auditActions}
          />
        )}
        {table.getColumn("user") && (
          <DataTableFacetedFilter
            column={table.getColumn("user")}
            title="Usuario"
            options={filterUsers ?? []}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="px-2 lg:px-3 h-8"
          >
            Reiniciar
            <Cross2Icon className="ml-2 w-4 h-4" />
          </Button>
        )}
      </div>
      <div className="flex space-x-2">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
