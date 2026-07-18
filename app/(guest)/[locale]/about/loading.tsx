export default function Loading() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="mb-2 h-3 w-24 animate-pulse rounded bg-gold/20" />
          <div className="mb-4 h-10 w-72 animate-pulse rounded bg-charcoal/10" />
          <div className="h-4 w-48 animate-pulse rounded bg-charcoal/5" />
        </div>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <div className="h-8 w-40 animate-pulse rounded bg-charcoal/10" />
            <div className="h-3 w-full animate-pulse rounded bg-charcoal/5" />
            <div className="h-3 w-full animate-pulse rounded bg-charcoal/5" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-charcoal/5" />
          </div>
          <div className="aspect-[4/3] animate-pulse rounded-2xl bg-charcoal/10" />
        </div>
      </div>
    </div>
  );
}
