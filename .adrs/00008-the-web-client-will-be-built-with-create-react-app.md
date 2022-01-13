# The Web Client Will Be Built With Create React App

- Status: Accepted

# Context

A means of building out a web client must be decided. To get started, we must answer the questions of how we are going to build the application and what framework we will use, if any.

## Build system

### Webpack

I have built and configured many systems using [Webpack](https://webpack.js.org/). It's extremely powerful but very time consuming to configure.

### Rollup

[Rollup](https://rollupjs.org/https://rollupjs.org/) works great for some people but it requires a large amount of configuration and isn't as well supported as Webpack.

### Snowpack

[Snowpack](https://www.snowpack.dev/) has a lot of potential but is still in it's infancy and doesn't handle all use cases yet.

### Create React App (layer over Webpack)

I've had a lot of success with [Create React App](https://create-react-app.dev/). It uses Webpack behind the scenes but handles the configuration for you. [Craco](https://github.com/gsoft-inc/craco) can be used for when that configuration needs to be tweaked.

## Framework/Libraries

### Angular

[Angular](https://angular.io/) has been used to build many large-scale apps but it encourages putting a lot of logic in the client and makes many design decisions that don't mesh well with me. Inherent state, "magic" variables, HTML templating, etc.

### Vue

[Vue](https://vuejs.org/) is up and coming but all of it's interesting features are already done better in other systems, in my opinion. It also has poor TypeScript support.

### React

[React](https://reactjs.org/) aims to be a view library with some features for state management. I have used it successfully in a number of projects now.

# Decision

We will use [Create React App](https://create-react-app.dev/) for a pre-configured build system.

We will use [React](https://reactjs.org/) for the UI and component system.

# Consequences

This will allow for a quick and robust development experience.

By utilizing Create React App, we are sacrificing some build choices in order to stay in the CRA ecosystem.
