"use client"
//Filtros
//TODO: Hacer también reutilizable
import { Cross2Icon, PlusCircledIcon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/data-table-view-options"
import { CirclePlus } from "lucide-react"
import { CreateProviderForm } from "./create-provider-form"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ResponsiveDialog } from "@/components/responsive-dialog"
import { CreateContactModal } from "./create-contact-modal"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [isModalOpen, setIsModalOpen] = useState(false)
  const route = useRouter()
  function handleSuccess() {
    setIsModalOpen(false)
    route.push("/contacts")
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filtrar provedores"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
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
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button variant="default" className="h-8 px-2 lg:px-3">
              Nuevo contacto
              <CirclePlus className="ml-2 h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Contacto</DialogTitle>
            </DialogHeader>
            {/* <ResponsiveDialog
              open={isCreateContactModalOpen}
              // onOpenChange={setIsCreateContactModalOpen}
              title="Agregar contacto"
              description="Agregue los datos correspondientes al contacto."
            > */}
            <CreateContactModal from="contacts" onSuccess={handleSuccess} />
            {/* </ResponsiveDialog> */}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
