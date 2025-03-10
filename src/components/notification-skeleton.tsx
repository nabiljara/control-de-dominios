export default function NotificationSkeleton() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="flex flex-col gap-4 p-4 border border-gray-100 rounded-lg w-full h-28">
          <div className="flex justify-between items-center gap-2">
            <div className="flex gap-2">
              {/* Icono skeleton */}
              <div className="bg-gray-200 rounded-full w-6 h-6 animate-pulse" />
              {/* Badge skeleton */}
              <div className="bg-gray-200 rounded-full w-24 h-6 animate-pulse" />
            </div>
            {/* Fecha skeleton */}
            <div className="bg-gray-200 rounded w-32 h-5 animate-pulse" />
          </div>

          <div className="flex flex-col justify-between items-start gap-2">
            {/* Texto largo skeleton */}
            <div className="bg-gray-200 rounded w-full h-5 animate-pulse" />
            <div className="bg-gray-200 rounded w-1/2 h-5 animate-pulse" />
          </div>
        </div>
      ))}
    </>
  )
}