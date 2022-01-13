import React, { useState } from 'react'

export interface CreateTaskProps {
  onSave?: (text: string) => void
}

export const CreateTask: React.FC<CreateTaskProps> = ({ onSave }) => {
  const [text, setText] = useState('')

  const saveTodo = () => onSave?.(text)

  return (
    <div>
      <input
        type="input"
        value={text}
        onChange={(evt) => setText(evt.currentTarget.value)}
        onKeyDown={(evt) => (evt.key === 'Enter' ? saveTodo() : null)}
      />
      <button onClick={saveTodo}>Save</button>
    </div>
  )
}
