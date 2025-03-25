import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function SkeletonTable() {
  const skeletonRows = Array.from({ length: 6 });

  return (
    <div className="space-y-2">
      <div className="h-fit">
        <div className="h-fit rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="rounded-tl-lg">
                  <Skeleton className="h-4 w-16" />
                </TableHead>
                <TableHead className="text-center">
                  <Skeleton className="mx-auto h-4 w-14" />
                </TableHead>
                <TableHead className="text-center">
                  <Skeleton className="mx-auto h-4 w-12" />
                </TableHead>
                <TableHead className="rounded-tr-lg text-center">
                  <Skeleton className="mx-auto h-4 w-24" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skeletonRows.map((_, index) => (
                <TableRow key={index}>
                  <TableCell
                    className={`font-medium ${index === skeletonRows.length - 1 ? "rounded-bl-lg" : ""}`}
                  >
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="mx-auto h-4 w-20" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="mx-auto h-4 w-24" />
                  </TableCell>
                  <TableCell
                    className={`text-center ${index === skeletonRows.length - 1 ? "rounded-br-lg" : ""}`}
                  >
                    <Skeleton className="mx-auto h-4 w-8" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
