export function FeatureCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="h-10 w-10 rounded-xl bg-slate-200" />
      <div className="mt-4 h-5 w-2/3 rounded bg-slate-200" />
      <div className="mt-3 h-4 w-full rounded bg-slate-100" />
      <div className="mt-2 h-4 w-5/6 rounded bg-slate-100" />
    </div>
  );
}

export function MarketingPropertyCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="h-48 w-full bg-slate-200" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-2/3 rounded bg-slate-200" />
        <div className="h-4 w-1/2 rounded bg-slate-100" />
        <div className="h-4 w-1/3 rounded bg-slate-100" />
      </div>
    </div>
  );
}
