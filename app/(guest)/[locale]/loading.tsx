export default function Loading() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-3 h-3 w-24 animate-pulse rounded bg-charcoal/10" />
          <div className="mx-auto mb-4 h-8 w-64 animate-pulse rounded bg-charcoal/10" />
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-charcoal/10 bg-white p-8">
              <div className="mb-5 h-14 w-14 animate-pulse rounded-full bg-gold/10" />
              <div className="mb-2 h-5 w-32 animate-pulse rounded bg-charcoal/10" />
              <div className="mb-4 h-3 w-full animate-pulse rounded bg-charcoal/5" />
              <div className="h-3 w-20 animate-pulse rounded bg-gold/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
