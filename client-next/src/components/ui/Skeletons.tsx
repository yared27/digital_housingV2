export function StatCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-5">
      <div className="h-4 w-28 rounded bg-slate-200" />
      <div className="mt-3 h-8 w-20 rounded bg-slate-200" />
      <div className="mt-3 h-3 w-36 rounded bg-slate-200" />
    </div>
  );
}

export function TableRowsSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="mb-3 animate-pulse rounded-lg border border-slate-100 p-4 last:mb-0">
          <div className="h-4 w-2/5 rounded bg-slate-200" />
          <div className="mt-2 h-3 w-3/5 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

export function CardsGridSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: cards }).map((_, idx) => (
        <div key={idx} className="animate-pulse rounded-xl border border-slate-200 bg-white p-4">
          <div className="h-40 rounded bg-slate-200" />
          <div className="mt-4 h-5 w-3/4 rounded bg-slate-200" />
          <div className="mt-2 h-4 w-1/2 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}
