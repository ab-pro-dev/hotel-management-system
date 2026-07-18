export default function Loading() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="mb-2 h-3 w-28 animate-pulse rounded bg-gold/20" />
          <div className="mb-4 h-10 w-80 animate-pulse rounded bg-charcoal/10" />
          <div className="h-4 w-72 animate-pulse rounded bg-charcoal/5" />
        </div>
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div className="h-6 w-32 animate-pulse rounded bg-charcoal/10" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="h-10 w-10 animate-pulse rounded-full bg-gold/10" />
                <div className="flex-1">
                  <div className="mb-1 h-2 w-16 animate-pulse rounded bg-charcoal/10" />
                  <div className="h-3 w-40 animate-pulse rounded bg-charcoal/5" />
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="h-6 w-24 animate-pulse rounded bg-charcoal/10" />
            <div className="mt-8 aspect-[4/3] animate-pulse rounded-2xl bg-charcoal/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
