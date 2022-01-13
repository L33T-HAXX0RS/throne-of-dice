import React, { useState } from 'react'
import { createStyles } from '~/common/styles'
import {
  themeKeyToName,
  getThemeValue,
  resetThemeValue,
  setThemeValue,
  Theme,
} from '~/theme'

export interface ThemePickerProps {
  themeKey: Theme
}

const themeValueToInputType: Record<Theme, 'color' | 'text'> = {
  [Theme.BackgroundColor]: 'color',
  [Theme.HeaderTextColor]: 'color',
  [Theme.NavigationBackgroundColor]: 'color',
  [Theme.PrimaryFont]: 'text',
  [Theme.TextColor]: 'color',
}

const useStyles = createStyles({
  colorInput: {
    background: 'transparent',
    border: 'none',
    height: 30,
    marginLeft: -4,
  },
})

export const ThemePicker: React.FC<ThemePickerProps> = ({ themeKey }) => {
  const styles = useStyles()
  const [value, setValue] = useState(getThemeValue(themeKey))

  const name = themeKeyToName(themeKey)
  const type = themeValueToInputType[themeKey]

  const onInput: React.FormEventHandler<HTMLInputElement> = (event) => {
    const newValue = event.currentTarget.value
    setValue(newValue)
    setThemeValue(themeKey, newValue)
  }
  const onReset = () => {
    setValue(resetThemeValue(themeKey))
  }

  return (
    <>
      <label>{name}</label>
      <input
        type={type}
        value={value}
        onInput={onInput}
        className={type === 'color' ? styles.colorInput : undefined}
      />
      <button onClick={onReset}>Reset</button>
    </>
  )
}
