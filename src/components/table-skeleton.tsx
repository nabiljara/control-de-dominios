import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown } from "lucide-react"

export default function DomainManagementSkeleton() {
  return (
    <div className="space-y-6 p-8">
      {/* Title and subtitle */}
      <div className="space-y-2">
        <Skeleton className="w-40 h-8" />
        <Skeleton className="w-64 h-4" />
      </div>

      {/* Search and filters */}
      <div className="flex justify-between items-center">
        <div className="w-64">
          <Input disabled placeholder="Filtrar ..." />
        </div>
        <Skeleton className="w-24 h-10" />
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        {/* Table header */}
        <div className="gap-4 grid grid-cols-3 bg-muted p-4">
          <Skeleton className="w-24 h-6" />
          <Skeleton className="w-24 h-6" />
          <Skeleton className="w-24 h-6" />
        </div>
        {/* Table rows */}
        {[...Array(10)].map((_, i) => (
          <div key={i} className="gap-4 grid grid-cols-3 p-4 border-t">
            <Skeleton className="w-full h-6" />
            <Skeleton className="w-24 h-6" />
            <Skeleton className="w-32 h-6" />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <Skeleton className="w-48 h-5" /> {/* "0 de 100 fila(s) seleccionadas." */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Skeleton className="w-36 h-5" /> {/* "Registros por página" */}
            <Button variant="outline" size="sm" disabled className="w-[70px]">
              10 <ChevronDown className="ml-2 w-4 h-4" />
            </Button>
          </div>
          <Skeleton className="w-24 h-5" /> {/* "Página 1 de 10" */}
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" disabled>
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" disabled>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" disabled>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" disabled>
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}