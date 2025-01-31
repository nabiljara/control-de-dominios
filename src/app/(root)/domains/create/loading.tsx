import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Card className="mx-auto w-full">
      <CardContent className="space-y-6 p-6">

      <div className="space-y-2">
            <Skeleton className="w-52 h-8" />
            <Skeleton className="w-64 h-3" />
          </div>
        
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="w-[70px] h-4" />
            <Skeleton className="w-full h-10" />
          </div>
          <div className="space-y-2">
            <Skeleton className="w-[70px] h-4" />
            <Skeleton className="w-full h-10" />
          </div>
        </div>


        <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="w-[70px] h-4" />
            <Skeleton className="w-full h-10" />
          </div>
          <div className="space-y-2">
            <Skeleton className="w-[70px] h-4" />
            <Skeleton className="w-full h-10" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="w-[140px] h-4" />
          <Skeleton className="w-96 h-[300px]" />
        </div>

        <div className="space-y-2">
          <Skeleton className="w-[100px] h-4" />
          <Skeleton className="w-full h-20" />
          <Skeleton className="w-full h-20" />
        </div>

        <div className="space-y-2">
          <Skeleton className="w-[80px] h-4" />
          <Skeleton className="w-full h-20" />
          <Skeleton className="w-full h-20" />

        </div>
        <div className="flex justify-end">
        <Skeleton className="w-52 h-10" />
        </div>
      </CardContent>
    </Card>
  )
}
