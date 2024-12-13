"use client"
//Filtros 
//TODO: Hacer también reutilizable
import { Cross2Icon, PlusCircledIcon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/data-table-view-options"

import { sizes, statuses } from "@/app/(root)/clients/data/data"
import { DataTableFacetedFilter } from "@/components/data-table-faceted-filter"
import { CirclePlus } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Locality } from "@/db/schema"
import { getLocalities } from "@/actions/locality-actions"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

type Options = {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [localities, setLocalities] = useState<Options[]>([]);
  useEffect(() => {
    const fetchLocalities = async () => {
      try {
        const localities = await getLocalities();
        const newLocalities: Options[] = []
        localities.map((locality) =>{
          const newLocality: Options = {
            label: locality.name,
            value: locality.id.toString()
          }
          newLocalities.push(newLocality)
        })
        setLocalities(newLocalities);
      } catch (error) {
        console.error("Error al cargar las localidades:", error);
      }
    };

    fetchLocalities();
  }, []);

  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filtrar clientes por nombre"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="w-[150px] lg:w-[250px] h-8"
        />
        {table.getColumn("locality") && (
          <DataTableFacetedFilter
            column={table.getColumn("locality")}
            title="Localidad"
            options={localities}
          />
        )}
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Estado"
            options={statuses}
          />
        )}
        {table.getColumn("size") && (
          <DataTableFacetedFilter
            column={table.getColumn("size")}
            title="Tamaño"
            options={sizes}
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
        <Button
          variant="default"
          className="px-2 lg:px-3 h-8"
          asChild
        >
          <Link href="/clients/create">
            Nuevo cliente
            <CirclePlus className="ml-2 w-5 h-5" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
