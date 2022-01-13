import React from 'react'

export interface TaskErrorProps {
  error?: string
  onTryAgain?: () => unknown
}

export const TaskError: React.FC<TaskErrorProps> = ({ error, onTryAgain }) => {
  if (!error) {
    return null
  }

  return (
    <div>
      <span>There was an error: {error}</span>
      <button onClick={onTryAgain}>Try again</button>
    </div>
  )
}
