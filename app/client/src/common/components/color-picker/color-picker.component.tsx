import React from 'react'
import { createStyles } from '~/common/styles'
import { Theme } from '~/theme'

export interface ColorPickerProps {
  label: string
  color?: string
  onChange?: (color: string) => unknown
}

const toFullRGB = (color = '#000') =>
  color.length === 4
    ? `#${color[1].repeat(2)}${color[2].repeat(2)}${color[3].repeat(2)}`
    : color

const useStyles = createStyles({
  container: {
    display: 'flex',
    fontFamily: Theme.PrimaryFont,
    alignItems: 'center',
  },
  label: {
    display: 'block',
    flex: 1,
  },
})

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  color,
  onChange,
}) => {
  const styles = useStyles()
  const onColorChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    onChange?.(event.currentTarget.value)
  }

  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <input type="color" onChange={onColorChange} value={toFullRGB(color)} />
    </div>
  )
}
