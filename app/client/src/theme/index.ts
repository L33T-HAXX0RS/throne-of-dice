/**
 * Themable values
 */
export enum Theme {
  BackgroundColor = 'var(--app-background-color)',
  HeaderTextColor = 'var(--app-header-text-color)',
  NavigationBackgroundColor = 'var(--app-navigation-background-color)',
  PrimaryFont = 'var(--app-primary-font)',
  TextColor = 'var(--app-text-color)',
}

const storageKey = '--app-theme'

const isTheme = (str: string): str is Theme =>
  Object.values(Theme).some((value) => value === str)

// Done in a record to guarantee that all values are captured
const defaultValuesRecord: Record<Theme, string> = {
  [Theme.BackgroundColor]: '#222222',
  [Theme.HeaderTextColor]: '#ffffff',
  [Theme.NavigationBackgroundColor]: '#1c1c1c',
  [Theme.PrimaryFont]: 'Arial, Helvetica, sans-serif',
  [Theme.TextColor]: '#eeeeee',
}

const defaultValues: Map<Theme, string> = new Map(
  Object.keys(defaultValuesRecord)
    .filter(isTheme)
    .map((key) => [key, defaultValuesRecord[key]]),
)

/**
 * Convert a `Theme` key to a property name
 *
 * ```ts
 * keyToPropertyName(Theme.PrimaryFont) === '--app-primary-font'
 * ```
 */
const keyToPropertyName = (key: Theme): string =>
  key.slice('var('.length, key.length - 1)

/**
 * Convert a property name to a `Theme` key
 *
 * ```ts
 * propertyNameToKey('--app-primary-font') === Theme.PrimaryFont
 * ```
 */
const propertyNameToKey = (propertyName: string): Theme =>
  `var(${propertyName})` as Theme

/**
 * Extract theme from local storage
 */
const getThemeFromStorage = (): Map<Theme, string> | null => {
  const themeJson = localStorage.getItem(storageKey)
  if (!themeJson) {
    return null
  }

  const serializedTheme = JSON.parse(themeJson)
  return new Map(
    Object.keys(serializedTheme).reduce((theme, propertyName) => {
      const key = propertyNameToKey(propertyName)
      theme.push([key, serializedTheme[propertyName]])
      return theme
    }, [] as [Theme, string][]),
  )
}

/**
 * Save theme to local storage
 */
const saveThemeToStorage = (theme: Map<Theme, string>) => {
  const serialized = Array.from(theme.entries()).reduce((acc, [key, value]) => {
    acc[keyToPropertyName(key)] = value
    return acc
  }, {} as Record<string, string>)
  localStorage.setItem(storageKey, JSON.stringify(serialized))
}

/**
 * Get the value for a part of the theme
 */
export const getThemeValue = (themeKey: Theme): string =>
  document.body.style.getPropertyValue(keyToPropertyName(themeKey))

/**
 * Set the value for a part of the theme
 */
export const setThemeValue = (themeKey: Theme, value: string): void => {
  document.body.style.setProperty(keyToPropertyName(themeKey), value)

  const theme = getThemeFromStorage()
  if (!theme) {
    return
  }

  theme.set(themeKey, value)
  saveThemeToStorage(theme)
}

/**
 * Reset theme value to default value
 */
export const resetThemeValue = (themeKey: Theme): string => {
  const value = defaultValuesRecord[themeKey]
  setThemeValue(themeKey, value)
  return value
}

/**
 * Get all of the available theme keys
 */
export const getThemeKeys = (): Theme[] => Array.from(defaultValues.keys())

/**
 * Apply theme from storage
 */
const loadTheme = () => {
  let theme = getThemeFromStorage()
  if (!theme) {
    saveThemeToStorage(defaultValues)
    theme = getThemeFromStorage()
    if (!theme) {
      throw new Error('Failed to load theme from storage')
    }
  }

  // Save any missing values
  const themeKeys = Object.keys(theme)
  const missingKeys = Object.keys(Theme).filter(
    (key) => !themeKeys.includes(key),
  ) as Theme[]
  for (const key of missingKeys) {
    setThemeValue(key, defaultValuesRecord[key])
  }
  if (missingKeys.length) {
    theme = getThemeFromStorage()
    if (!theme) {
      throw new Error('Failed to load theme from storage')
    }
  }

  for (const [key, value] of Array.from(theme.entries())) {
    setThemeValue(key, value)
  }
}

/**
 * Get the name of a theme value
 */
export const themeKeyToName = (theme: Theme): string | null => {
  const entries = Object.entries(Theme)
  const index = entries.findIndex(([_key, value]) => value === theme)
  if (index >= 0) {
    const titlecaseName = entries[index][0]
    return titlecaseName.replace(/([a-z][A-Z])/g, (match) => {
      const [end, start] = match
      return `${end} ${start.toLocaleLowerCase()}`
    })
  }
  return null
}

/**
 * Load and apply theme theme
 */
export const initializeTheme = (): void => {
  const customProperties = Array.from(defaultValues.entries()).map(
    ([reference, defaultValue]) =>
      `${keyToPropertyName(reference)}: ${defaultValue}`,
  )

  const themeStyleSheet = document.createElement('style')
  themeStyleSheet.innerHTML = `:root{${customProperties.join(';')}}`
  document.head.appendChild(themeStyleSheet)
  loadTheme()
}
