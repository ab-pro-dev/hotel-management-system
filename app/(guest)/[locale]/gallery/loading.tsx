export default function Loading() {
  return (
    <div className="min-h-screen bg-charcoal">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="mb-2 h-3 w-20 animate-pulse rounded bg-gold/20" />
          <div className="mb-4 h-10 w-56 animate-pulse rounded bg-white/10" />
          <div className="h-4 w-80 max-w-full animate-pulse rounded bg-white/5" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse overflow-hidden rounded-xl bg-white/5">
              <div className="aspect-[4/3] bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
