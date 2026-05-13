import TaskItem from './TaskItem'

export default function TaskList({ tasks, onToggle, onDelete, onEdit }) {
  return (
    <ul className="space-y-2">
      {tasks.map((task, index) => (
        <TaskItem
          key={task.id}
          task={task}
          index={index}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  )
}
