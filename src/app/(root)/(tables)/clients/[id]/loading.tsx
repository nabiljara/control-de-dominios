import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
export default function Loading() {
  return (
    <div className="space-y-4 p-8 min-h-screen overflow-hidden">
      <Card className="w-full overflow-hidden">
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-16">
          <div className="flex items-center space-x-3">
            <Skeleton className="rounded-full w-8 h-8" />
            <Skeleton className="w-20 h-6" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="w-12 h-4" />
            <Skeleton className="rounded-full w-9 h-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-start">

            <div className="space-y-2">
              <Skeleton className="w-12 h-4" />
              <Skeleton className="rounded-full w-16 h-6" />
            </div>
            <div className="space-y-2">
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-20 h-5" />
            </div>

            <div className="space-y-2">
              <Skeleton className="w-14 h-4" />
              <Skeleton className="rounded-full w-18 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full overflow-hidden">
        <CardHeader className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Skeleton className="rounded-full w-8 h-8" />
              <div>
                <Skeleton className="w-20 h-6" />
                <Skeleton className="mt-1 w-48 h-4" />
              </div>
            </div>
            <Skeleton className="w-32 h-9" />
          </div>

          <div className="flex justify-between items-center gap-4">
            <div className="flex flex-1 items-center space-x-2">
              <Skeleton className="w-64 h-9" />
              <Skeleton className="w-16 h-8" />
              <Skeleton className="w-20 h-8" />
            </div>
            <Skeleton className="w-12 h-8" />
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Skeleton className="w-16 h-4" />
                </TableHead>
                <TableHead>
                  <Skeleton className="w-20 h-4" />
                </TableHead>
                <TableHead>
                  <Skeleton className="w-14 h-4" />
                </TableHead>
                <TableHead>
                  <Skeleton className="w-32 h-4" />
                </TableHead>
                <TableHead>
                  <Skeleton className="w-36 h-4" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Skeleton className="w-48 h-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-20 h-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="rounded-full w-16 h-6" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-20 h-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-20 h-4" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="flex justify-end items-center gap-10 mt-4">
            <div className="flex items-center space-x-2">
              <Skeleton className="w-32 h-4" />
              <Skeleton className="w-12 h-8" />
            </div>

            <div className="flex items-center space-x-4">
              <Skeleton className="w-20 h-4" />
              <div className="flex items-center space-x-1">
                <Skeleton className="w-8 h-8" />
                <Skeleton className="w-8 h-8" />
                <Skeleton className="w-8 h-8" />
                <Skeleton className="w-8 h-8" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full overflow-hidden">
        <CardHeader className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Skeleton className="rounded-full w-8 h-8" />
              <div>
                <Skeleton className="w-20 h-6" />
                <Skeleton className="mt-1 w-48 h-4" />
              </div>
            </div>
            <Skeleton className="w-32 h-9" />
          </div>

          <div className="flex justify-between items-center gap-4">
            <div className="flex flex-1 items-center space-x-2">
              <Skeleton className="w-64 h-9" />
              <Skeleton className="w-16 h-8" />
              <Skeleton className="w-20 h-8" />
            </div>
            <Skeleton className="w-12 h-8" />
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Skeleton className="w-16 h-4" />
                </TableHead>
                <TableHead>
                  <Skeleton className="w-20 h-4" />
                </TableHead>
                <TableHead>
                  <Skeleton className="w-14 h-4" />
                </TableHead>
                <TableHead>
                  <Skeleton className="w-32 h-4" />
                </TableHead>
                <TableHead>
                  <Skeleton className="w-36 h-4" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Skeleton className="w-48 h-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-20 h-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="rounded-full w-16 h-6" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-20 h-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-20 h-4" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="flex justify-end items-center gap-10 mt-4">
            <div className="flex items-center space-x-2">
              <Skeleton className="w-32 h-4" />
              <Skeleton className="w-12 h-8" />
            </div>

            <div className="flex items-center space-x-4">
              <Skeleton className="w-20 h-4" />
              <div className="flex items-center space-x-1">
                <Skeleton className="w-8 h-8" />
                <Skeleton className="w-8 h-8" />
                <Skeleton className="w-8 h-8" />
                <Skeleton className="w-8 h-8" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full overflow-hidden">
        <CardHeader className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Skeleton className="rounded-full w-8 h-8" />
              <div>
                <Skeleton className="w-20 h-6" />
                <Skeleton className="mt-1 w-48 h-4" />
              </div>
            </div>
            <Skeleton className="w-32 h-9" />
          </div>

          <div className="flex justify-between items-center gap-4">
            <div className="flex flex-1 items-center space-x-2">
              <Skeleton className="w-64 h-9" />
              <Skeleton className="w-16 h-8" />
              <Skeleton className="w-20 h-8" />
            </div>
            <Skeleton className="w-12 h-8" />
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Skeleton className="w-16 h-4" />
                </TableHead>
                <TableHead>
                  <Skeleton className="w-20 h-4" />
                </TableHead>
                <TableHead>
                  <Skeleton className="w-14 h-4" />
                </TableHead>
                <TableHead>
                  <Skeleton className="w-32 h-4" />
                </TableHead>
                <TableHead>
                  <Skeleton className="w-36 h-4" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Skeleton className="w-48 h-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-20 h-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="rounded-full w-16 h-6" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-20 h-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-20 h-4" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="flex justify-end items-center gap-10 mt-4">
            <div className="flex items-center space-x-2">
              <Skeleton className="w-32 h-4" />
              <Skeleton className="w-12 h-8" />
            </div>

            <div className="flex items-center space-x-4">
              <Skeleton className="w-20 h-4" />
              <div className="flex items-center space-x-1">
                <Skeleton className="w-8 h-8" />
                <Skeleton className="w-8 h-8" />
                <Skeleton className="w-8 h-8" />
                <Skeleton className="w-8 h-8" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>


    </div>
  )
}
