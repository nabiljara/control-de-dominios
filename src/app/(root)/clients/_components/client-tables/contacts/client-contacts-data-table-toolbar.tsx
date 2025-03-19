"use client"
import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/data-table-view-options"
import { DataTableFacetedFilter } from "@/components/data-table-faceted-filter"
import { contactStatus, contactTypes } from "@/constants"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  return (
    <div className="flex lg:flex-row flex-col justify-between items-start lg:items-center gap-2">
      <div className="flex lg:flex-row flex-col flex-1 items-start lg:items-center gap-2 w-full">
        <div className="relative w-2/3 lg:w-[250px]">
          <Input
            id="filter-contacts"
            placeholder="Filtrar por nombre o email"
            value={(table.getColumn("combinedFilter")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("combinedFilter")?.setFilterValue(event.target.value)
            }
            className="h-8"
          />
        </div>
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Estado"
            options={contactStatus.slice()}
          />
        )}
        {table.getColumn("type") && (
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="Tipo"
            options={contactTypes.slice()}
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
      <DataTableViewOptions table={table} />
    </div>
  )
}
