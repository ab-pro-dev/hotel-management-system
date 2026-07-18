export default function Loading() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="mb-2 h-3 w-28 animate-pulse rounded bg-gold/20" />
          <div className="mb-4 h-10 w-72 animate-pulse rounded bg-charcoal/10" />
          <div className="h-4 w-96 max-w-full animate-pulse rounded bg-charcoal/5" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-charcoal/10 bg-white">
              <div className="aspect-[16/9] animate-pulse bg-charcoal/5" />
              <div className="p-6">
                <div className="mb-2 h-5 w-40 animate-pulse rounded bg-charcoal/10" />
                <div className="mb-4 h-3 w-full animate-pulse rounded bg-charcoal/5" />
                <div className="h-3 w-24 animate-pulse rounded bg-gold/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
