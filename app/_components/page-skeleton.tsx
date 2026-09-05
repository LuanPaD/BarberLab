const Bar = ({ className }: { className: string }) => (
  <div className={`bg-muted/60 animate-pulse rounded-md ${className}`} />
)

const PageSkeleton = () => (
  <div className="mx-auto max-w-5xl space-y-6 p-5 lg:px-8 lg:py-10">
    <div className="space-y-3">
      <Bar className="h-3 w-24" />
      <Bar className="h-7 w-64 max-w-full" />
      <Bar className="h-4 w-80 max-w-full" />
    </div>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Bar key={i} className="h-40" />
      ))}
    </div>
  </div>
)

export default PageSkeleton
