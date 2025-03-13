"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/data-table-view-options"
import { DataTableFacetedFilter } from "@/components/data-table-faceted-filter"
import { UserPlus } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"
import { CommandShortcut } from "@/components/ui/command"
import { useRouter } from "next/navigation"
import { clientSizes, clientStatus } from "@/constants"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filterLocalities?: Array<string>
}

export function DataTableToolbar<TData>({
  table,
  filterLocalities
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const router = useRouter()

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

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "n" && (e.metaKey || e.altKey)) {
        e.preventDefault()
        router.push("/clients/create")
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [router])

  return (
    <div className="flex lg:flex-row flex-col justify-between items-start lg:items-center gap-2">
      <div className="flex lg:flex-row flex-col flex-1 items-start lg:items-center gap-2 w-full">
        <div className="relative w-2/3 lg:w-[250px]">
          <Input
            id="filter"
            placeholder="Filtrar clientes por nombre"
            autoFocus
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="h-8"
          />
          <div className="hidden md:block right-2 -bottom-[7px] absolute text-gray-400 -translate-y-1/2">
            <CommandShortcut>⌘F</CommandShortcut>
          </div>
        </div>

        {table.getColumn("locality") && (
          <DataTableFacetedFilter
            column={table.getColumn("locality")}
            title="Localidad"
            options={filterLocalities ?? []}
          />
        )}
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Estado"
            options={clientStatus.slice()}
          />
        )}
        {table.getColumn("size") && (
          <DataTableFacetedFilter
            column={table.getColumn("size")}
            title="Tamaño"
            options={clientSizes.slice()}
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
      <div className="flex gap-2">
        <DataTableViewOptions table={table} />
        <Button
          variant="outline"
          className="px-2 h-8"
          asChild
        >
          <Link
            href="/clients/create"
          >
            <UserPlus className="w-5 h-5" />
            <CommandShortcut>⌘N</CommandShortcut>
          </Link>
        </Button>
      </div>
    </div>
  )
}
