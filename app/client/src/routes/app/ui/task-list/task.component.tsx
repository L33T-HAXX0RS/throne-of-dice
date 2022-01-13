import { TaskDto } from '@utility/common/dtos'
import React, { useState } from 'react'

export interface TodoProps {
  id: string
  text: string
  done: boolean
  onChange?: (task: TaskDto) => void
  onRemove?: (id: string) => void
}

export const Task: React.FC<TodoProps> = ({
  id,
  text,
  done,
  onChange,
  onRemove,
}) => {
  const [isChecked, setIsChecked] = useState(done)
  const onCheck = (checked: boolean) => {
    setIsChecked(checked)
    onChange?.({
      id,
      text,
      done: checked,
    })
  }

  const onClickRemove = () => {
    onRemove?.(id)
  }
  return (
    <>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={(evt) => onCheck(evt.currentTarget.checked)}
      />
      <span>{text}</span>
      <button onClick={onClickRemove}>Remove</button>
    </>
  )
}
