import { Search, Trash2 } from 'lucide-react'

const TABS = [
  { key: 'all',       label: 'All'       },
  { key: 'active',    label: 'Active'    },
  { key: 'completed', label: 'Completed' },
]

export default function FilterBar({ filter, onFilter, search, onSearch, onClearDone, hasDone }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center animate-fade-in">
      {/* Filter tabs */}
      <div className="flex gap-1 glass rounded-xl p-1">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => onFilter(tab.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200
              ${filter === tab.key
                ? 'bg-gradient-to-r from-brand-500 to-violet-600 text-white shadow-md shadow-brand-500/30'
                : 'text-white/40 hover:text-white/70'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Right side: search + clear */}
      <div className="flex items-center gap-2 sm:ml-auto">
        <div className="flex items-center gap-2 glass rounded-xl px-3 py-1.5">
          <Search className="w-4 h-4 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Search…"
            className="bg-transparent text-sm text-white/70 placeholder-white/25 outline-none w-32"
          />
        </div>

        {hasDone && (
          <button
            onClick={onClearDone}
            title="Clear completed tasks"
            className="flex items-center gap-1.5 glass rounded-xl px-3 py-1.5 text-xs
                       font-semibold text-rose-400/80 hover:text-rose-400
                       hover:bg-rose-500/10 transition-all duration-200"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear done
          </button>
        )}
      </div>
    </div>
  )
}
