const EmptyState = ({ icon = '📭', title = 'Nothing here yet', description = '', action }) => (
  <div className="flex flex-col items-center justify-center py-14 px-4 text-center bg-white rounded-xl border border-slate-200/80 shadow-xs">
    <div className="text-5xl mb-3 animate-float">{icon}</div>
    <h3 className="font-headline-sm text-lg font-bold text-slate-800 mb-1">{title}</h3>
    {description && <p className="font-body-md text-slate-500 text-sm max-w-sm mb-5">{description}</p>}
    {action && (
      <button onClick={action.onClick} className="btn-brand">
        {action.label}
      </button>
    )}
  </div>
);

export default EmptyState;
