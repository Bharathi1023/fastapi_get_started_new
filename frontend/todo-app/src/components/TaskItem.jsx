import { useState, useRef, useEffect } from 'react'
import { Check, Trash2, Pencil, X, Calendar, Tag } from 'lucide-react'

const PRIORITY_CONFIG = {
  high:   { dot: 'bg-rose-500',    badge: 'bg-rose-500/15 text-rose-400 border-rose-500/25',    label: 'High'   },
  medium: { dot: 'bg-amber-400',   badge: 'bg-amber-400/15 text-amber-400 border-amber-400/25',  label: 'Medium' },
  low:    { dot: 'bg-emerald-500', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25', label: 'Low' },
}

const CATEGORY_ICONS = {
  personal: '👤', work: '💼', health: '❤️', learning: '📚', finance: '💰',
}

function formatDate(dateStr) {
  if (!dateStr) return null
  const [y, m, d] = dateStr.split('-')
  return new Date(+y, +m - 1, +d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function isDueOverdue(dateStr) {
  if (!dateStr) return false
  const [y, m, d] = dateStr.split('-')
  return new Date(+y, +m - 1, +d) < new Date(new Date().setHours(0,0,0,0))
}

export default function TaskItem({ task, index, onToggle, onDelete, onEdit }) {
  const [editing, setEditing]   = useState(false)
  const [draft,   setDraft]     = useState(task.text)
  const [visible, setVisible]   = useState(false)
  const inputRef = useRef(null)
  const pCfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium

  // Staggered entrance animation
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 40)
    return () => clearTimeout(t)
  }, [index])

  // Focus input when editing starts
  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const commitEdit = () => {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== task.text) onEdit(task.id, trimmed)
    else setDraft(task.text)
    setEditing(false)
  }

  const cancelEdit = () => {
    setDraft(task.text)
    setEditing(false)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter')  commitEdit()
    if (e.key === 'Escape') cancelEdit()
  }

  const overdue = !task.done && isDueOverdue(task.due)

  return (
    <li
      className={`group glass rounded-2xl px-4 py-3.5 flex items-start gap-3
        transition-all duration-300 border border-transparent
        hover:border-white/10 hover:bg-white/[0.07]
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}
        ${task.done ? 'opacity-60' : ''}
      `}
      style={{ transitionProperty: 'opacity, transform', transitionDuration: '300ms' }}
    >
      {/* Priority dot */}
      <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${pCfg.dot} ring-4 ring-current/20`} />

      {/* Check button */}
      <button
        onClick={() => onToggle(task.id)}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center
          transition-all duration-200 mt-0.5 hover:scale-110 active:scale-95
          ${task.done
            ? 'border-brand-500 bg-brand-500 shadow-md shadow-brand-500/40'
            : 'border-white/20 hover:border-brand-500/60 hover:bg-brand-500/10'
          }`}
        title={task.done ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.done && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={handleKey}
            onBlur={commitEdit}
            maxLength={120}
            className="w-full bg-white/10 rounded-lg px-2 py-0.5 text-sm text-white
                       outline-none border border-brand-500/50 caret-brand-400"
          />
        ) : (
          <p className={`text-sm font-medium leading-snug break-words
            ${task.done ? 'line-through text-white/30' : 'text-white/90'}`}>
            {task.text}
          </p>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          {/* Priority badge */}
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${pCfg.badge}`}>
            {pCfg.label}
          </span>

          {/* Category */}
          {task.category && (
            <span className="flex items-center gap-1 text-[10px] text-white/30">
              <Tag className="w-2.5 h-2.5" />
              {CATEGORY_ICONS[task.category]} {task.category}
            </span>
          )}

          {/* Due date */}
          {task.due && (
            <span className={`flex items-center gap-1 text-[10px] font-medium
              ${overdue ? 'text-rose-400' : 'text-white/30'}`}>
              <Calendar className="w-2.5 h-2.5" />
              {overdue && !task.done ? '⚠️ ' : ''}
              {formatDate(task.due)}
            </span>
          )}
        </div>
      </div>

      {/* Action buttons (shown on hover) */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-0.5">
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="p-1.5 rounded-lg text-white/30 hover:text-brand-400 hover:bg-brand-500/15
                       transition-all duration-150"
            title="Edit task"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        )}
        {editing && (
          <button
            onClick={cancelEdit}
            className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/10
                       transition-all duration-150"
            title="Cancel edit"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={() => onDelete(task.id)}
          className="p-1.5 rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-500/15
                     transition-all duration-150"
          title="Delete task"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </li>
  )
}
