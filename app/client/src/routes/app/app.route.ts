import { connect } from 'react-redux'
import { createMapStateToProps } from '~/common/lenses'
import {
  errorLens,
  isInitializedLens,
  loadingLens,
  newTaskTextLens,
  tasksLens,
} from './app.lenses'
import { createTask, fetchTasks, removeTask, updateTask } from './effects'
import { App as AppComponent } from './ui'

const mapStateToProps = createMapStateToProps({
  tasks: tasksLens,
  newTaskText: newTaskTextLens,
  loading: loadingLens,
  error: errorLens,
  isInitialized: isInitializedLens,
})

const mapDispatchToProps = {
  fetchTasks,
  createTask,
  removeTask,
  updateTask,
}

export type StateProps = ReturnType<typeof mapStateToProps>
export type DispatchProps = typeof mapDispatchToProps

export const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent)
