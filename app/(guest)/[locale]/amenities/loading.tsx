export default function Loading() {
  return (
    <div className="min-h-screen bg-charcoal">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="mb-2 h-3 w-24 animate-pulse rounded bg-gold/20" />
          <div className="mb-4 h-10 w-80 animate-pulse rounded bg-white/10" />
          <div className="h-4 w-96 max-w-full animate-pulse rounded bg-white/5" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-xl border border-white/5 bg-white/5 p-6">
              <div className="mb-4 h-14 w-14 animate-pulse rounded-full bg-gold/10" />
              <div className="mb-1 h-4 w-32 animate-pulse rounded bg-white/10" />
              <div className="h-3 w-full animate-pulse rounded bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
