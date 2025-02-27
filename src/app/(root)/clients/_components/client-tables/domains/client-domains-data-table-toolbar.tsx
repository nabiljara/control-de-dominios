"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/data-table-view-options"
import { DataTableFacetedFilter } from "@/components/data-table-faceted-filter"
import { Globe } from "lucide-react"
import Link from "next/link"
import Plus from "@/components/plus"
import { CommandShortcut } from "@/components/ui/command"
import { domainStatus } from "@/constants"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filterProviders?: Array<string> // Los proveedores para realizar el filtrado
}

export function DataTableToolbar<TData>({
  table,
  filterProviders
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative w-[250px]">
          <Input
            id="filter-domains"
            placeholder="Filtrar dominios por nombre"
            autoFocus
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="mr-3 w-full h-8"
          />
          <div className="right-2 -bottom-[7px] absolute text-gray-400 -translate-y-1/2">
            <CommandShortcut>⌘F</CommandShortcut>
          </div>
        </div>
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Estado"
            options={domainStatus.slice()}
          />
        )}
        {table.getColumn("provider") && (
          <DataTableFacetedFilter
            column={table.getColumn("provider")}
            title="Proveedor"
            options={filterProviders ?? []}
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
