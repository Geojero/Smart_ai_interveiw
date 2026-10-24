// Skeleton loader component for loading states matching Blue & White Slate theme
export const SkeletonCard = ({ className = '' }) => (
  <div className={`skeleton h-32 rounded-xl border border-slate-200/60 ${className}`} />
);

export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2.5 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="skeleton h-4 rounded-md"
        style={{ width: `${100 - i * 15}%` }}
      />
    ))}
  </div>
);

export const SkeletonStat = () => (
  <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-3">
    <div className="skeleton h-4 w-24 rounded" />
    <div className="skeleton h-8 w-16 rounded" />
    <div className="skeleton h-3 w-32 rounded" />
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="space-y-2.5">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="skeleton h-12 rounded-lg" />
    ))}
  </div>
);
