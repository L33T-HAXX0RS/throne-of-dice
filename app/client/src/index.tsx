import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Route, RouteProps, Router, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { hasOwnProperty } from '@utility/common/object'
import './index.css'
import reportWebVitals from './report-web-vitals'
import { initializeTheme } from './theme'
import { createStore } from './store'

if (hasOwnProperty(document, 'head')) {
  initializeTheme()
}

const history = createBrowserHistory()
const store = createStore()

interface LazyRouteProps extends RouteProps {
  fallback?: React.ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: React.LazyExoticComponent<any>
}

const AppRoute = lazy(() => import('./routes/app'))
const ThemeRoute = lazy(() => import('./routes/theme'))

const LazyRoute = ({
  fallback = null,
  Component,
  ...routeProps
}: LazyRouteProps) => (
  <Route {...routeProps}>
    <Suspense fallback={fallback}>
      <Component />
    </Suspense>
  </Route>
)

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router history={history}>
        <Switch>
          <LazyRoute exact path="/" Component={AppRoute} />
          <LazyRoute path="/theme" Component={ThemeRoute} />
        </Switch>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
