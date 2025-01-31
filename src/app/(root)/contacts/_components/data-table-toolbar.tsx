"use client"
//Filtros
//TODO: Hacer también reutilizable
import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/data-table-view-options"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CreateContactModal } from "./create-contact-modal"
import { getClients } from "@/actions/client-actions"
import { DataTableFacetedFilter } from "@/components/data-table-faceted-filter"
import { contactStatus, contactTypes } from "../../clients/data/data"
import { CommandShortcut } from "@/components/ui/command"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

type Options = {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

export function DataTableToolbar<TData>({
  table
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [clients, setClients] = useState<Options[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clients = await getClients();
        const newClients: Options[] = []
        clients.map((client) => {
          const newClient: Options = {
            label: client.name,
            value: client.id.toString()
          }
          newClients.push(newClient)
        })
        newClients.push({
          label: 'Sin cliente',
          value: 'Sin cliente'
        })
        setClients(newClients);
      } catch (error) {
        console.error("Error al cargar los clientes:", error);
      }
    };
    fetchClients();
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

  return (
    <div className="flex justify-between items-center">
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
            className="w-[150px] lg:w-[250px] h-8"
          />
          <div className="right-2 -bottom-[7px] absolute text-gray-400 -translate-y-1/2">
            <CommandShortcut>⌘F</CommandShortcut>
          </div>
        </div>
        {table.getColumn("client") && (
          <DataTableFacetedFilter
            column={table.getColumn("client")}
            title="Cliente"
            options={clients}
          />
        )}
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Estado"
            options={contactStatus}
          />
        )}
        {table.getColumn("type") && (
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="Tipo"
            options={contactTypes}
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
        <CreateContactModal from="contacts" />
      </div>
    </div>
  )
}
