import { Theme } from '~/theme'
import { createStyles } from './util.styles'

/**
 * Styles shared between all routes
 */
export const useRouteStyles = createStyles({
  root: {
    backgroundColor: Theme.BackgroundColor,
    textAlign: 'center',
    minHeight: '100vh',
  },
  main: {
    display: 'flex',
    maxWidth: '80vw',
    margin: '0 auto',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'calc(10px + 2vmin)',
  },
  header: {
    color: Theme.HeaderTextColor,
  },
})
