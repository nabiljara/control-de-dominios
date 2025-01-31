"use client"
import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/data-table-view-options"
import { DataTableFacetedFilter } from "@/components/data-table-faceted-filter"
import { useEffect, useState } from "react"
import { getUsers } from "@/actions/user-action/user-actions"
import { auditActions, auditEntities } from "../../clients/data/data"
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
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [users, setUsers] = useState<Options[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const newUsers: Options[] = []
        const users = await getUsers()
        users.map((user) => {
          const newUser: Options = {
            label: user.name,
            value: user.name
          }
          newUsers.push(newUser)
        })
        newUsers.push({
          label: 'Sin usuario',
          value: 'Sin usuario'
        })
        setUsers(newUsers)
      } catch (error) {
        console.error("Error al obtener los usuarios:", error)
      }
    }
    fetchUsers()
  }, [])

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
            placeholder="Filtrar auditorias por entidad"
            autoFocus
            value={(table.getColumn("entity")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("entity")?.setFilterValue(event.target.value)
            }
            className="w-[150px] lg:w-[250px] h-8"
          />
          <div className="right-2 -bottom-[7px] absolute text-gray-400 -translate-y-1/2">
            <CommandShortcut>⌘F</CommandShortcut>
          </div>
        </div>
        {table.getColumn("entity") && (
          <DataTableFacetedFilter
            column={table.getColumn("entity")}
            title="Entidad"
            options={auditEntities}
          />
        )}
        {table.getColumn("action") && (
          <DataTableFacetedFilter
            column={table.getColumn("action")}
            title="Acción"
            options={auditActions}
          />
        )}
        {table.getColumn("user") && (
          <DataTableFacetedFilter
            column={table.getColumn("user")}
            title="Usuario"
            options={users}
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
      </div>
    </div>
  )
}
