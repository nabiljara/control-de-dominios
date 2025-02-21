"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/data-table-view-options"
import { clientSizes,  clientStatus } from "@/app/(root)/clients/data/data"
import { DataTableFacetedFilter } from "@/components/data-table-faceted-filter"
import { UserPlus } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getLocalities } from "@/actions/locality-actions"
import { CommandShortcut } from "@/components/ui/command"
import { useRouter } from "next/navigation"

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
  const router = useRouter()

  useEffect(() => {
    const fetchLocalities = async () => {
      try {
        const localities = await getLocalities();
        const newLocalities: Options[] = []
        localities.map((locality) => {
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
    <div className="flex justify-between items-center">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative w-[250px]">
          <Input
            id="filter"
            placeholder="Filtrar clientes por nombre"
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
            options={clientStatus}
          />
        )}
        {table.getColumn("size") && (
          <DataTableFacetedFilter
            column={table.getColumn("size")}
            title="Tamaño"
            options={clientSizes}
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
          variant="outline"
          className="px-2 lg:px-3 h-8"
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
