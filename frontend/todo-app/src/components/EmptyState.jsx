import { CheckCircle2, Search, ClipboardList } from 'lucide-react'

const STATES = {
  all:       { Icon: ClipboardList, title: 'No tasks yet!',    sub: 'Add your first task above to get started.' },
  active:    { Icon: CheckCircle2,  title: 'All done!',        sub: 'Nothing left to do — great work! 🎉'       },
  completed: { Icon: CheckCircle2,  title: 'Nothing done yet', sub: 'Complete a task and it will appear here.'  },
}

export default function EmptyState({ filter, search }) {
  if (search) {
    return (
      <div className="flex flex-col items-center py-16 gap-4 animate-fade-in">
        <Search className="w-12 h-12 text-white/15" />
        <p className="text-white/30 font-medium">No tasks match "<span className="text-white/50">{search}</span>"</p>
      </div>
    )
  }

  const { Icon, title, sub } = STATES[filter] || STATES.all

  return (
    <div className="flex flex-col items-center py-16 gap-4 animate-fade-in">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-500/20 to-violet-600/20
                      flex items-center justify-center border border-white/5 shadow-xl">
        <Icon className="w-9 h-9 text-brand-400" />
      </div>
      <div className="text-center space-y-1">
        <h3 className="text-lg font-bold text-white/70">{title}</h3>
        <p className="text-sm text-white/30">{sub}</p>
      </div>
    </div>
  )
}
