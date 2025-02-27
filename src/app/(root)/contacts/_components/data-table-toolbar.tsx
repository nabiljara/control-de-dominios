"use client"
import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/data-table-view-options"
import { useEffect} from "react"
import { DataTableFacetedFilter } from "@/components/data-table-faceted-filter"
import { CommandShortcut } from "@/components/ui/command"
import { Contact2 } from "lucide-react"
import Plus from "@/components/plus"
import { Client } from "@/db/schema"
import { ContactModal } from "@/components/contact-modal"
import { contactStatus, contactTypes } from "@/constants"

export interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filterClients?: Array<string> // Los clientes para realizar el filtrado
  formClients?: Client[] // Los clientes para el formulario
}

export function DataTableToolbar<TData>({
  table,
  filterClients,
  formClients
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
    <div className="flex justify-between items-center w-full">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative w-[250px]">
          <Input
            id="filter"
            placeholder="Filtrar por nombre o email"
            autoFocus
            value={(table.getColumn("combinedFilter")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("combinedFilter")?.setFilterValue(event.target.value)
            }
            className="h-8"
          />
          <div className="right-2 -bottom-[7px] absolute text-gray-400 -translate-y-1/2">
            <CommandShortcut>⌘F</CommandShortcut>
          </div>
        </div>
        {table.getColumn("client") && (
          <DataTableFacetedFilter
            column={table.getColumn("client")}
            title="Cliente"
            options={filterClients ?? []}
          />
        )}
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
      <div className="flex space-x-2">
        <DataTableViewOptions table={table} />
        <ContactModal
          clients={formClients}
          pathToRevalidate={`/contacts`}
          command
        >
          <Button
            variant="outline"
            className="gap-3 px-2 lg:px-3 h-8"
          >
            <div className="relative">
              <div className="flex flex-row justify-center items-center gap-4 text-xs">
                <Contact2 />
                <Plus />
                <CommandShortcut>⌘N</CommandShortcut>
              </div>
            </div>
          </Button>
        </ContactModal>
      </div>

    </div>
  )
}
