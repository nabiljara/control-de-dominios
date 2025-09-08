import { Skeleton } from "@/components/ui/skeleton"

export default function FormSkeleton() {
  return (
    <div className="w-full p-6 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-2" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-2" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-6 w-6" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-6 w-6" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-2" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <div className="flex justify-end">
        <Skeleton className="h-10 w-52" />
      </div>
    </div>
  )
}