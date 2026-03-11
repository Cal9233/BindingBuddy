export default function ProductsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="h-10 w-48 bg-poke-card rounded-xl animate-pulse mb-8" />

      <div className="flex gap-3 mb-8">
        <div className="h-10 w-36 bg-poke-card rounded-xl animate-pulse" />
        <div className="h-10 w-36 bg-poke-card rounded-xl animate-pulse" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-poke-card border border-poke-border rounded-2xl overflow-hidden"
          >
            <div className="h-56 bg-white/5 animate-pulse" />
            <div className="p-5 space-y-3">
              <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
              <div className="h-5 w-3/4 bg-white/5 rounded animate-pulse" />
              <div className="h-3 w-full bg-white/5 rounded animate-pulse" />
              <div className="h-3 w-2/3 bg-white/5 rounded animate-pulse" />
              <div className="flex items-center justify-between pt-3 border-t border-poke-border">
                <div className="h-6 w-16 bg-white/5 rounded animate-pulse" />
                <div className="h-9 w-16 bg-white/5 rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
