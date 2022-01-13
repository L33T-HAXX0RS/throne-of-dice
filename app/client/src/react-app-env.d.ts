/// <reference types="react-scripts" />
import { compose } from 'redux'

declare global {
  interface Window {
    env: EnvironmentVariables
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: (settings: unknown) => typeof compose
  }
}
