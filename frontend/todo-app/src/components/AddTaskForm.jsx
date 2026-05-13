import { useState, useRef } from 'react'
import { Plus, AlertCircle } from 'lucide-react'
import { uid } from '../utils/storage'

const CATEGORIES = [
  { value: 'personal', label: '👤 Personal' },
  { value: 'work',     label: '💼 Work'     },
  { value: 'health',   label: '❤️ Health'   },
  { value: 'learning', label: '📚 Learning' },
  { value: 'finance',  label: '💰 Finance'  },
]

const PRIORITIES = [
  { value: 'low',    label: '🟢 Low'    },
  { value: 'medium', label: '🟡 Medium' },
  { value: 'high',   label: '🔴 High'   },
]

export default function AddTaskForm({ onAdd }) {
  const [text,     setText]     = useState('')
  const [priority, setPriority] = useState('medium')
  const [category, setCategory] = useState('personal')
  const [due,      setDue]      = useState('')
  const [shake,    setShake]    = useState(false)
  const inputRef = useRef(null)

  const handleSubmit = (e) => {
    e?.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) {
      setShake(true)
      setTimeout(() => setShake(false), 350)
      inputRef.current?.focus()
      return
    }
    onAdd({
      id:       uid(),
      text:     trimmed,
      done:     false,
      priority,
      category,
      due:      due || null,
      createdAt: Date.now(),
    })
    setText('')
    setDue('')
    inputRef.current?.focus()
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-4 space-y-3 animate-slide-in">
      {/* Text input */}
      <div className={`flex items-center gap-3 ${shake ? 'animate-shake' : ''}`}>
        <AlertCircle className="w-5 h-5 text-brand-400 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder="What needs to get done?"
          maxLength={120}
          className="flex-1 bg-transparent text-white placeholder-white/30 outline-none text-sm font-medium"
        />
        <span className="text-xs text-white/20">{text.length}/120</span>
      </div>

      <div className="h-px bg-white/5" />

      {/* Options row */}
      <div className="flex flex-wrap items-center gap-2">
        <Select
          id="priority"
          label="Priority"
          value={priority}
          onChange={setPriority}
          options={PRIORITIES}
        />
        <Select
          id="category"
          label="Category"
          value={category}
          onChange={setCategory}
          options={CATEGORIES}
        />
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">
            Due Date
          </label>
          <input
            type="date"
            value={due}
            onChange={e => setDue(e.target.value)}
            className="glass rounded-lg px-3 py-1.5 text-xs text-white/70 outline-none
                       focus:border-brand-500/50 border border-transparent
                       [color-scheme:dark] cursor-pointer"
          />
        </div>

        <button
          type="submit"
          className="ml-auto flex items-center gap-2 px-5 py-2 rounded-xl
                     bg-gradient-to-r from-brand-500 to-violet-600
                     hover:from-brand-400 hover:to-violet-500
                     text-white text-sm font-semibold shadow-lg shadow-brand-500/30
                     transition-all duration-200 active:scale-95 hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>
    </form>
  )
}

function Select({ id, label, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="glass rounded-lg px-3 py-1.5 text-xs text-white/70 outline-none
                   focus:border-brand-500/50 border border-transparent
                   [color-scheme:dark] cursor-pointer"
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}
