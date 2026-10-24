// Circular progress gauge component matching Blue & White Slate theme
const ScoreGauge = ({ score = 0, size = 160, strokeWidth = 10, label = 'Score', showTrend = false, trendText = '+13 pts improvement' }) => {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (Math.min(Math.max(score, 0), 100) / 100) * circumference;
  const offset = circumference - progress;

  const getColor = (s) => {
    if (s >= 80) return '#2563eb'; // blue-600
    if (s >= 60) return '#0284c7'; // sky-600
    if (s >= 40) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90 transform">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getColor(score)}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display-hero text-3xl font-bold text-slate-900 tracking-tight leading-none">{score}</span>
          <span className="font-label-code-sm text-xs text-slate-400 uppercase font-semibold mt-0.5">/ 100</span>
        </div>
      </div>
      {label && <span className="font-label-ui text-sm font-semibold text-slate-700">{label}</span>}
      {showTrend && (
        <div className="flex items-center gap-1 text-emerald-600 font-label-code-sm text-xs font-semibold">
          <span className="material-symbols-outlined text-sm">trending_up</span>
          <span>{trendText}</span>
        </div>
      )}
    </div>
  );
};

export default ScoreGauge;
