"use client"
import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/data-table-view-options"
import { Box } from "lucide-react"
import { CreateProviderForm } from "./create-provider-form"
import { useEffect, useState } from "react"
import Plus from "@/components/plus"
import { ResponsiveDialog } from "@/components/responsive-dialog"
import { CommandShortcut } from "@/components/ui/command"
interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "n" && (e.metaKey || e.altKey)) {
        e.preventDefault()
        setIsModalOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
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
            placeholder="Filtrar proveedores por nombre"
            autoFocus
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="mr-2 w-[150px] lg:w-[250px] h-8"
          />
          <div className="right-2 -bottom-[7px] absolute text-gray-400 -translate-y-1/2">
            <CommandShortcut>⌘F</CommandShortcut>
          </div>
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="px-2 h-8 e-3 lg:px"
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
          className="gap-3 px-2 lg:px-3 h-8"
          onClick={() => {
            setIsModalOpen(true)
          }}>
          <div className="relative">
            <div className="flex flex-row justify-center items-center gap-4 text-xs">
              <Box />
              <Plus />
              <CommandShortcut>⌘N</CommandShortcut>
            </div>
          </div>
        </Button>
      </div>
      <ResponsiveDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Nuevo proveedor"
        description="Ingrese los datos correspondientes al proveedor."
        className="md:max-w-[500px]"
      >
        <CreateProviderForm setIsOpen={setIsModalOpen} />
      </ResponsiveDialog>
    </div>
  )
}
