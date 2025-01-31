"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/data-table-view-options"

import { domainStatus } from "@/app/(root)/clients/data/data"
import { DataTableFacetedFilter } from "@/components/data-table-faceted-filter"
import { Globe, Router } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getClients } from "@/actions/client-actions"
import { getProviders } from "@/actions/provider-actions"
import Plus from "@/components/plus"
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
  const router = useRouter()
  const isFiltered = table.getState().columnFilters.length > 0

  const [clients, setClients] = useState<Options[]>([]);

  const [providers, setProviders] = useState<Options[]>([]);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const providers = await getProviders();
        const newProviders: Options[] = []
        providers.map((provider) => {
          const newProvider: Options = {
            label: provider.name,
            value: provider.id.toString()
          }
          newProviders.push(newProvider)
        })
        setProviders(newProviders);
      } catch (error) {
        console.error("Error al cargar las localidades:", error);
      }
    };

    fetchProviders();
  }, []);

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
        setClients(newClients);
      } catch (error) {
        console.error("Error al cargar las localidades:", error);
      }
    };

    fetchClients();
  }, []);


  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "n" && (e.metaKey || e.altKey)) {
        e.preventDefault()
        router.push("/domains/create")
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [router])

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
            options={domainStatus}
          />
        )}
        {table.getColumn("client") && (
          <DataTableFacetedFilter
            column={table.getColumn("client")}
            title="Cliente"
            options={clients}
          />
        )}
        {table.getColumn("provider") && (
          <DataTableFacetedFilter
            column={table.getColumn("provider")}
            title="Proveedor"
            options={providers}
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
          <Link href="/domains/create" className="relative gap-3">
            <div className="relative">
              <div className="flex flex-row gap-4 text-xs">
                <Globe />
                <Plus />
                <CommandShortcut>⌘N</CommandShortcut>
              </div>
            </div>
          </Link>
        </Button>
      </div>
    </div>
  )
}
