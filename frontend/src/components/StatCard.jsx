function StatCard({ title, value, subtitle, icon: Icon }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <h3 className="text-2xl font-bold text-slate-900 mt-2">
            {value}
          </h3>

          <p className="text-xs text-slate-500 mt-2">
            {subtitle}
          </p>
        </div>

        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
          <Icon size={20} className="text-slate-700" />
        </div>
      </div>
    </div>
  );
}

export default StatCard;