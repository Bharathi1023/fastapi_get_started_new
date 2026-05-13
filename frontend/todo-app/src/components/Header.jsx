import { CheckSquare } from 'lucide-react'

const PRIORITY_COLORS = {
  high:   'bg-rose-500',
  medium: 'bg-amber-400',
  low:    'bg-emerald-500',
}

export default function Header({ stats }) {
  return (
    <div className="animate-fade-in">
      {/* Title */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 shadow-lg shadow-brand-500/30">
          <CheckSquare className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-brand-200 to-violet-300 bg-clip-text text-transparent">
            TaskFlow
          </h1>
          <p className="text-sm text-white/40 font-medium">Your smart productivity companion</p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatCard label="Total"     value={stats.total}     gradient="from-slate-600/60 to-slate-700/60" />
        <StatCard label="Active"    value={stats.active}    gradient="from-brand-600/60 to-violet-700/60" glow />
        <StatCard label="Done"      value={stats.completed} gradient="from-emerald-600/60 to-teal-700/60" />
      </div>

      {/* Progress bar */}
      <div className="glass rounded-2xl p-4">
        <div className="flex justify-between text-xs font-semibold text-white/50 mb-2">
          <span>Overall Progress</span>
          <span className="text-brand-400">{stats.pct}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-violet-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${stats.pct}%` }}
          />
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, gradient, glow }) {
  return (
    <div className={`glass rounded-2xl p-4 text-center ${glow ? 'shadow-lg shadow-brand-500/20' : ''}`}>
      <div className={`text-3xl font-extrabold bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}
           style={{ WebkitTextFillColor: 'white', backgroundClip: 'unset' }}>
        <span className={`bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}>
          {value}
        </span>
      </div>
      <div className="text-xs font-medium text-white/40 mt-1">{label}</div>
    </div>
  )
}
