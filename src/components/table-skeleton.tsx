import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown } from "lucide-react"

export default function DomainManagementSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Title and subtitle */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Search and filters */}
      <div className="flex justify-between items-center">
        <div className="w-64">
          <Input disabled placeholder="Filtrar clientes" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        {/* Table header */}
        <div className="bg-muted p-4 grid grid-cols-3 gap-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
        </div>
        {/* Table rows */}
        {[...Array(10)].map((_, i) => (
          <div key={i} className="p-4 grid grid-cols-3 gap-4 border-t">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-32" />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-48" /> {/* "0 de 100 fila(s) seleccionadas." */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-36" /> {/* "Registros por página" */}
            <Button variant="outline" size="sm" disabled className="w-[70px]">
              10 <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <Skeleton className="h-5 w-24" /> {/* "Página 1 de 10" */}
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" disabled>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" disabled>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" disabled>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}