import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCardWrapper() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="mt-2 lg:mt-0">
              <Skeleton className="mx-auto h-10 w-20 lg:mx-0" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
