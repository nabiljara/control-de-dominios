"use client"
//Filtros 
//TODO: Hacer también reutilizable
import { Cross2Icon, PlusCircledIcon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/data-table-view-options"

import { segments, statuses } from "@/app/(root)/clients/data/data"
import { DataTableFacetedFilter } from "@/components/data-table-faceted-filter"
import { CirclePlus } from "lucide-react"
import Link from "next/link"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filtrar clientes"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Estado"
            options={statuses}
          />
        )}
        {table.getColumn("segment") && (
          <DataTableFacetedFilter
            column={table.getColumn("segment")}
            title="Segmento"
            options={segments}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reiniciar
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex space-x-2">
        <DataTableViewOptions table={table} />
        <Button
          variant="default"
          className="h-8 px-2 lg:px-3"
          asChild
        >
          <Link href="/domains/create">
          Nuevo dominio
          <CirclePlus className="h-5 w-5 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
