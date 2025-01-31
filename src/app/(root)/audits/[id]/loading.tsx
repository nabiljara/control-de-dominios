import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function Loading() {
  return (
    <div className="space-y-8 p-6">

      <div className="flex items-center space-x-3">
        <Skeleton className="w-6 h-6" />
        <Skeleton className="w-24 h-7" />
      </div>

      <div className="items-center grid grid-cols-4">

        <div className="flex items-center space-x-2">
          <Skeleton className="w-5 h-5" />
          <div className="space-y-1">
            <Skeleton className="w-16 h-3" />
            <Skeleton className="w-32 h-4" />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Skeleton className="w-5 h-5" />
          <div className="space-y-1">
            <Skeleton className="w-12 h-3" />
            <Skeleton className="w-24 h-4" />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Skeleton className="w-5 h-5" />
          <div className="space-y-1">
            <Skeleton className="w-36 h-3" />
            <Skeleton className="w-28 h-4" />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Skeleton className="w-5 h-5" />
          <div className="space-y-1">
            <Skeleton className="w-16 h-3" />
            <Skeleton className="w-20 h-4" />
          </div>
        </div>

      </div>

      <Card className="border rounded-lg w-2/3">
        <CardContent className="p-6">

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <Skeleton className="w-5 h-5" />
              <Skeleton className="w-48 h-5" />
            </div>
            <Badge variant="outline" className="bg-green-50">
              <Skeleton className="w-16 h-4" />
            </Badge>
          </div>

          <div className="gap-6 grid grid-cols-2 md:grid-cols-3">

            <div className="flex items-start space-x-3">
              <Skeleton className="mt-1 w-5 h-5" />
              <div className="space-y-1">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-36 h-5" />
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Skeleton className="mt-1 w-5 h-5" />
              <div className="space-y-1">
                <Skeleton className="w-40 h-4" />
                <Skeleton className="w-36 h-5" />
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Skeleton className="mt-1 w-5 h-5" />
              <div className="space-y-1">
                <Skeleton className="w-16 h-4" />
                <Skeleton className="w-28 h-5" />
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Skeleton className="mt-1 w-5 h-5" />
              <div className="space-y-1">
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-32 h-5" />
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Skeleton className="mt-1 w-5 h-5" />
              <div className="space-y-1">
                <Skeleton className="w-16 h-4" />
                <Skeleton className="w-48 h-5" />
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Skeleton className="mt-1 w-5 h-5" />
              <div className="space-y-1">
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-28 h-5" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-6 h-6" />
          <Skeleton className="w-48 h-7" />
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">
                    <Skeleton className="w-16 h-4" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="w-28 h-4" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="w-24 h-4" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 8 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
