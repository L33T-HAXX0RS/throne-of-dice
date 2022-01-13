# Use A Backend-For-Frontend Pattern

- Status: Accepted

## Context

The web client acts as a visual face for the system. Protocols must be established for communicating with the system and how much logic is done client-side versus server-side.

By implementing a [Backend for Frontend](https://samnewman.io/patterns/architectural/bff/) pattern, we keep all of our business logic on the server.

## Decision

We will use a Backend for Frontend pattern for the application.

The routes on the client will following the following file system pattern:

```
- routes
  - {route} # Folder for the application route
    - effects/ # Side effects. Calls out to the server for functionality
    - ui/ # Contains dumb components
    - {route}.api.ts # Define the BFF endpoint connections
    - {route}.lenses.ts # Lenses for the routes state
    - {route}.route.ts # Bind the UI to the store
    - {route}.types.ts # Type necessary for users of the route, namely the state shape
    - index.ts # Exports the bound UI and sagas
```

## Consequences

All of the business logic will live on the server.

The client can stay relatively lightweight.

When the business logic changes, only the backend will need to be updated.
