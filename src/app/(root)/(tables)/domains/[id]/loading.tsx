export default function Loading() {
  return (
    <div className="flex flex-col items-end gap-4 p-8">
      {/* Edit Switch */}
      <div className="flex items-center gap-2">
        <div className="bg-muted rounded w-16 h-5 animate-pulse" />

        <div className="bg-muted rounded-full w-14 h-6 animate-pulse" />
      </div>


      {/* Main Content with Border */}
      <div className="space-y-6 p-6 border rounded-lg w-full">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-muted rounded w-5 h-5 animate-pulse" />
            <div className="bg-muted rounded w-64 h-5 animate-pulse" />
          </div>
          <div className="bg-muted rounded w-44 h-5 animate-pulse" />
          <div className="bg-muted rounded w-44 h-5 animate-pulse" />
        </div>

        {/* Cards Grid */}
        <div className="gap-6 grid md:grid-cols-3">
          {/* Client Card */}
          <div className="space-y-4 p-6 border rounded-lg">
            <div className="flex items-center gap-2">
              <div className="bg-muted rounded w-5 h-5 animate-pulse" />
              <div className="bg-muted rounded w-28 h-5 animate-pulse" />
            </div>
            <div className="space-y-3">
              <div className="bg-muted rounded w-40 h-5 animate-pulse" />
              <div className="flex items-center gap-2">
                <div className="bg-muted rounded w-20 h-5 animate-pulse" />
                <div className="bg-muted rounded-full w-20 h-5 animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-muted rounded w-20 h-5 animate-pulse" />
                <div className="bg-muted rounded-full w-20 h-5 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="space-y-4 p-6 border rounded-lg">
            <div className="flex items-center gap-2">
              <div className="bg-muted rounded w-5 h-5 animate-pulse" />
              <div className="bg-muted rounded w-28 h-5 animate-pulse" />
            </div>
            <div className="space-y-3">
              <div className="bg-muted rounded w-40 h-5 animate-pulse" />
              <div className="bg-muted rounded w-56 h-5 animate-pulse" />
              <div className="bg-muted rounded w-40 h-5 animate-pulse" />
              <div className="bg-muted rounded-full w-20 h-5 animate-pulse" />
            </div>
          </div>

          {/* Provider Card */}
          <div className="space-y-4 p-6 border rounded-lg">
            <div className="flex items-center gap-2">
              <div className="bg-muted rounded w-5 h-5 animate-pulse" />
              <div className="bg-muted rounded w-28 h-5 animate-pulse" />
            </div>
            <div className="space-y-3">
              <div className="bg-muted rounded w-40 h-5 animate-pulse" />
              <div className="bg-muted rounded w-56 h-5 animate-pulse" />
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="bg-muted rounded w-5 h-5 animate-pulse" />
            <div className="bg-muted rounded w-28 h-5 animate-pulse" />
          </div>

          <div className="flex gap-2 mb-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-muted rounded w-28 h-8 animate-pulse" />
            ))}
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="gap-4 grid grid-cols-5 bg-muted/5 p-4 border-b">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-muted rounded w-full h-5 animate-pulse" />
              ))}
            </div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="gap-4 grid grid-cols-5 p-4 border-b">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="bg-muted rounded w-full h-5 animate-pulse" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

