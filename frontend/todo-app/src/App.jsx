import { useState, useEffect, useMemo } from 'react'
import Header from './components/Header'
import AddTaskForm from './components/AddTaskForm'
import FilterBar from './components/FilterBar'
import TaskList from './components/TaskList'
import EmptyState from './components/EmptyState'
import { fetchTasks, createTask, updateTask, deleteTask } from './utils/api'

export default function App() {
  const [tasks,   setTasks]   = useState([])
  const [filter,  setFilter]  = useState('all')   // all | active | completed
  const [search,  setSearch]  = useState('')
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  // ── Load tasks from backend on mount ─────────────────────────────────────
  useEffect(() => {
    fetchTasks()
      .then(setTasks)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  /* ── Derived stats ───────────────────────────────── */
  const stats = useMemo(() => {
    const total     = tasks.length
    const completed = tasks.filter(t => t.done).length
    const active    = total - completed
    const pct       = total === 0 ? 0 : Math.round((completed / total) * 100)
    return { total, completed, active, pct }
  }, [tasks])

  const filteredTasks = useMemo(() => {
    let list = tasks
    if (filter === 'active')    list = list.filter(t => !t.done)
    if (filter === 'completed') list = list.filter(t =>  t.done)
    if (search.trim())          list = list.filter(t =>
      t.text.toLowerCase().includes(search.toLowerCase()))
    return list
  }, [tasks, filter, search])

  /* ── Task mutations (optimistic updates + API sync) ─────────────────── */
  const addTask = async (taskData) => {
    try {
      const newTask = await createTask({
        text:     taskData.text,
        priority: taskData.priority,
        category: taskData.category,
        due:      taskData.due,
      })
      setTasks(prev => [newTask, ...prev])
    } catch (err) {
      console.error('Failed to create task:', err.message)
    }
  }

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
    try {
      await updateTask(id, { done: !task.done })
    } catch (err) {
      // Revert on failure
      setTasks(prev => prev.map(t => t.id === id ? { ...t, done: task.done } : t))
      console.error('Failed to toggle task:', err.message)
    }
  }

  const editTask = async (id, text) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    setTasks(prev => prev.map(t => t.id === id ? { ...t, text } : t))
    try {
      await updateTask(id, { text })
    } catch (err) {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, text: task.text } : t))
      console.error('Failed to edit task:', err.message)
    }
  }

  const removeTask = async (id) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    setTasks(prev => prev.filter(t => t.id !== id))
    try {
      await deleteTask(id)
    } catch (err) {
      setTasks(prev => [task, ...prev])
      console.error('Failed to delete task:', err.message)
    }
  }

  const clearDone = async () => {
    const doneTasks = tasks.filter(t => t.done)
    setTasks(prev => prev.filter(t => !t.done))
    try {
      await Promise.all(doneTasks.map(t => deleteTask(t.id)))
    } catch (err) {
      setTasks(prev => [...doneTasks, ...prev])
      console.error('Failed to clear completed tasks:', err.message)
    }
  }

  const reorderTasks = (reordered) => setTasks(reordered)

  /* ── Render ──────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      {/* Ambient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-brand-600/20 blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-violet-600/15 blur-[100px] animate-pulse delay-700" />
        <div className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] rounded-full bg-sky-600/10 blur-[90px] animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-10 space-y-6">
        <Header stats={stats} />

        {/* Loading / error banners */}
        {loading && (
          <div className="glass rounded-2xl px-4 py-3 text-sm text-white/50 text-center animate-pulse">
            Loading tasks from server…
          </div>
        )}
        {error && (
          <div className="glass rounded-2xl px-4 py-3 text-sm text-rose-400 text-center border border-rose-500/20">
            ⚠️ Could not connect to backend: {error}
          </div>
        )}

        {!loading && (
          <>
            <AddTaskForm onAdd={addTask} />
            <FilterBar
              filter={filter}
              onFilter={setFilter}
              search={search}
              onSearch={setSearch}
              onClearDone={clearDone}
              hasDone={stats.completed > 0}
            />
            {filteredTasks.length > 0
              ? <TaskList
                  tasks={filteredTasks}
                  onToggle={toggleTask}
                  onDelete={removeTask}
                  onEdit={editTask}
                  onReorder={reorderTasks}
                />
              : <EmptyState filter={filter} search={search} />
            }
          </>
        )}
      </div>
    </div>
  )
}
