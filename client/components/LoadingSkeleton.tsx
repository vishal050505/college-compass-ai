export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
      <div className="h-44 bg-slate-200" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-slate-200 rounded-lg w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-1/2" />
        <div className="grid grid-cols-3 gap-2">
          <div className="h-12 bg-slate-100 rounded-xl" />
          <div className="h-12 bg-slate-100 rounded-xl" />
          <div className="h-12 bg-slate-100 rounded-xl" />
        </div>
        <div className="h-10 bg-slate-200 rounded-xl mt-2" />
      </div>
    </div>
  );
}