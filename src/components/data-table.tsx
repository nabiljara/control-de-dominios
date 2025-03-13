"use client"
import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Table as TanStackTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

import { DataTablePagination } from "@/components/data-table-pagination"
import { useRouter } from "next/navigation"
import { Client } from "@/db/schema"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  ToolbarComponent?: React.ComponentType<{ table: TanStackTable<TData>, filterClients?: Array<string>, formClients?: Client[], filterLocalities?: Array<string>, filterProviders?: Array<string>, filterUsers?: Array<string> }>;
  filterClients?: Array<string> // Los clientes para realizar el filtrado
  formClients?: Client[] // Los clientes para el formulario de nuevo contacto
  filterLocalities?: Array<string> // Las localidades para realizar el filtrado
  filterProviders?: Array<string> // Los proveedores para realizar el filtrado
  filterUsers?: Array<string> // Los usuarios para realizar el filtrado
  from?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  ToolbarComponent,
  from,
  filterClients,
  formClients,
  filterLocalities,
  filterProviders,
  filterUsers
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      id: false,
    })
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  })

  return (
    <div className="space-y-4">
      {ToolbarComponent && <ToolbarComponent
        table={table}
        filterClients={filterClients}
        formClients={formClients}
        filterLocalities={filterLocalities}
        filterProviders={filterProviders} 
        filterUsers={filterUsers}
        />}
      <div className="border rounded-md">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {
                table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onClick={
                        from ? () => router.push(`/${from}/${row.getAllCells()[0].getValue()}`) : undefined
                      }
                      className={from ? "cursor-pointer" : ""}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No hay resultados.
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </div>
      <DataTablePagination table={table} />
    </div>
  )
}
