import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonOverviewDomain() {
  return (
    <div className="relative h-[300px] w-full md:h-[375px]">
      <div className="flex h-full w-full flex-col">
        <div className="absolute left-0 top-0 flex h-full w-10 flex-col justify-between py-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={`y-${i}`} className="h-4 w-6" />
          ))}
        </div>
        <div className="absolute inset-0 flex items-end px-10 pb-10">
          <div className="relative h-[70%] w-full">
            <Skeleton className="h-full w-full opacity-30" />
            <div className="absolute bottom-0 left-0 right-0 flex justify-between">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={`point-${i}`} className="flex flex-col items-center">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="mt-2 h-3 w-12" />
                </div>
              ))}
            </div>
            <div className="absolute left-0 right-0 top-1/2 h-1">
              <Skeleton className="h-full w-full rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
