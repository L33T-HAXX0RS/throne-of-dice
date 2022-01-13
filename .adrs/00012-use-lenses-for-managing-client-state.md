# Use Lenses For Managing Client State

- Status: Accepted

## Context

When using a [Redux](https://redux.js.org/) store, patterns must be established for accessing the state.

Using the full state object means that all consumers must be aware of the full shape of the state. For example,

```js
state.routes.myRoute.users[0].id
```

One approach for both accessing and updating the store is to use [lenses](https://mcluck.tech/blog/reduce-redux-boilerplate-with-lenses/). By using lenses, we also completely remove the need for unique reducers. Using the previous example, a users ID could be updated like this:

```js
put(updateState(usersIdLens(0).set(newId)))
```

## Decision

We will use lenses to access and modify the data store.

We will use [`@optiqs/optiqs`](https://www.npmjs.com/package/@optiqs/optiqs) to remove the need for multiple reducers.

## Consequences

Users of state will not need to know the entire data shape.

Modifying the shape of the state tree will not require sweeping changes across the codebase.

Given all state tree updates will be done via a single action type, Redux logs will be harder to parse when looking for the original cause of an issue. In theory, the preceding actions should tell the developer what lead to that state change but it does require that extra step.
