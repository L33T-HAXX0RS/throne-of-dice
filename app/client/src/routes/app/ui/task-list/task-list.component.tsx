import { TaskDto } from '@utility/common/dtos'
import React from 'react'
import { createStyles } from '~/common/styles'
import { CreateTask } from './create-task.component'
import { TaskError } from './task-error.component'
import { Task } from './task.component'

export interface TaskListProps {
  error: string | undefined
  tasks: TaskDto[]
  createTask: (text: string) => void
  fetchTasks: () => void
  removeTask: (id: string) => void
  updateTask: (task: TaskDto) => void
}

const useStyles = createStyles({
  tasks: {
    marginTop: '1em',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    columnGap: '0.5em',
    textAlign: 'left',
    '& input': {
      marginTop: 8,
    },
  },
})

export const TaskList: React.FC<TaskListProps> = ({
  error,
  tasks,
  createTask,
  fetchTasks,
  removeTask,
  updateTask,
}) => {
  const styles = useStyles()
  return (
    <div>
      <CreateTask onSave={createTask} />
      <TaskError error={error} onTryAgain={fetchTasks} />
      <div className={styles.tasks}>
        {(tasks || []).map((task) => (
          <Task
            key={task.id}
            {...task}
            onChange={updateTask}
            onRemove={removeTask}
          />
        ))}
      </div>
    </div>
  )
}
