"use client"
//Filtros
//TODO: Hacer también reutilizable
import { Cross2Icon, PlusCircledIcon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/data-table-view-options"
import { DataTableFacetedFilter } from "@/components/data-table-faceted-filter"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getUsers } from "@/actions/user-action/user-actions"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  interface UserOption {
    value: string
    label: string
  }
  const entities = [
    {
      value: "providers",
      label: "Proveedores"
    },
    {
      value: "localities",
      label: "Localidades"
    },
    {
      value: "domains",
      label: "Dominios"
    },
    {
      value: "access",
      label: "Accesos"
    },
    {
      value: "clients",
      label: "Clientes"
    },
    {
      value: "users",
      label: "Usuarios"
    }
  ]
  const actions = [
    {
      value: "INSERT",
      label: "INSERT"
    },
    {
      value: "UPDATE",
      label: "UPDATE"
    },
    {
      value: "DELETE",
      label: "DELETE"
    }
  ]
  const users = [
    {
      value: null,
      label: "Sin nombre"
    },
    {
      value: "lucca",
      label: "lucca"
    }
  ]
  const [userOptions, setUserOptions] = useState<UserOption[]>([])
  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getUsers()
        const formattedUsers = data.map(
          (user: { id: string; name: string | null }) => ({
            value: user.name ?? "Sin usuario",
            label: user.name ?? "Sin usuario"
          })
        )

        const additionalOption = { value: "Sin usuario", label: "Sin usuario" }
        setUserOptions([...formattedUsers, additionalOption])
      } catch (error) {
        console.error("Error al obtener los usuarios:", error)
      }
    }

    fetchUsers()
  }, [])
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filtrar Auditorias"
          value={(table.getColumn("entity")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("entity")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("entity") && (
          <DataTableFacetedFilter
            column={table.getColumn("entity")}
            title="Entidad"
            options={entities}
          />
        )}
        {table.getColumn("action") && (
          <DataTableFacetedFilter
            column={table.getColumn("action")}
            title="Acción"
            options={actions}
          />
        )}
        {/* TODO: Obtiene los usuarios pero no muestra bien el valor seleccionado en la tabla */}
        {/* {table.getColumn("user_name") && (
          <DataTableFacetedFilter
            column={table.getColumn("user_name")}
            title="Usuario"
            options={userOptions}
          />
        )} */}
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
      </div>
    </div>
  )
}
