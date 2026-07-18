export default function Loading() {
  return (
    <div className="min-h-screen bg-charcoal">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="mb-2 h-3 w-20 animate-pulse rounded bg-gold/20" />
          <div className="mb-4 h-10 w-64 animate-pulse rounded bg-white/10" />
          <div className="h-4 w-96 max-w-full animate-pulse rounded bg-white/5" />
        </div>
        <div className="flex flex-col gap-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="grid gap-8 lg:grid-cols-2">
              <div className="aspect-[4/3] animate-pulse rounded-2xl bg-white/5" />
              <div className="flex flex-col justify-center gap-4">
                <div className="h-3 w-32 animate-pulse rounded bg-gold/20" />
                <div className="h-7 w-48 animate-pulse rounded bg-white/10" />
                <div className="h-3 w-full animate-pulse rounded bg-white/5" />
                <div className="h-3 w-24 animate-pulse rounded bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
