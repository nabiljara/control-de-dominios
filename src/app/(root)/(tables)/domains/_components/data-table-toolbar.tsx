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
  filterClients?: Array<string> // Los clientes para realizar el filtrado
  filterProviders?: Array<string> // Los proveedores para realizar el filtrado
}

export function DataTableToolbar<TData>({
  table,
  filterClients,
  filterProviders
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex lg:flex-row flex-col justify-between items-start lg:items-center gap-2">
      <div className="flex lg:flex-row flex-col flex-1 items-start lg:items-center gap-2 w-full">
        <div className="relative w-2/3 lg:w-[250px]">
          <Input
            id="filter"
            placeholder="Filtrar dominios por nombre"
            autoFocus
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="h-8"
          />
        </div>
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Estado"
            options={domainStatus.slice()}
          />
        )}
        {table.getColumn("client") && (
          <DataTableFacetedFilter
            column={table.getColumn("client")}
            title="Cliente"
            options={filterClients ?? []}
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
      <div className="flex flex-row gap-2 w-full">
        <DataTableViewOptions table={table} />
        <Button
          variant="outline"
          className="px-2 lg:px-3 w-2/3 lg:w-auto h-8"
          asChild
        >
          <Link href="/domains/create" className="relative">
            <div className="relative">
              <div className="flex flex-row gap-4 text-xs">
                <Globe />
                <Plus />
              </div>
            </div>
          </Link>
        </Button>
      </div>
    </div>
  )
}
