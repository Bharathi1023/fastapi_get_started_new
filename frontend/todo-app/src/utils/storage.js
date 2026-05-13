// Persist tasks in localStorage
export const loadTasks = () => {
  try {
    const raw = localStorage.getItem('taskflow-tasks')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const saveTasks = (tasks) => {
  try {
    localStorage.setItem('taskflow-tasks', JSON.stringify(tasks))
  } catch {
    // storage full or unavailable
  }
}

// Generate a unique ID
export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2)
