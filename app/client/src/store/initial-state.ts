import { State } from '~/types'

export const initialState: State = {
  routes: {
    app: {
      server: {
        tasks: [],
      },
      local: {
        newTaskText: '',
        isInitialized: false,
      },
    },
  },
}
