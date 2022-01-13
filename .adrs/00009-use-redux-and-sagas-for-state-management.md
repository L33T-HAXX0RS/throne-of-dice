# Use Redux And Sagas For State Management

- Status: Accepted

# Context

Large applications necessarily need to manage their state as well as their functionality.

[Redux](https://redux.js.org/) is the industry standard for state management. It can be as little or as big as you need it to be. Combined with [Redux Saga](https://redux-saga.js.org/), you get a very well-designed event queue with support for handling side effects in central locations.

# Decision

I will use [Redux](https://redux.js.org/) for state management combined with [Redux Saga](https://redux-saga.js.org/) for side effect management.

# Consequences

Handling side effects via Redux Saga will provide a framework for adding functionality and give an easier way of identifying where logic bugs could occur.

Patterns must be established around how to utilize Redux and sagas in order to avoid spaghetti code.

By using Redux, a certain amount of boilerplate will be necessary.
