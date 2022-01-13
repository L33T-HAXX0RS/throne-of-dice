# Use React Router For Inter-app Routing

- Status: Accepted

## Context

The web client will contain multiple views. To enable access to multiple views, we require a strategy for developing and routing to those views.

[React Router](https://reactrouter.com/) is the de-facto standard for doing routing in a [React](https://reactjs.org/) application.

## Decision

We will use React Router for splitting out our application in to different routes.

Different routes will be loaded asynchronously to enable code splitting and reduce download time for users.

## Consequences

Splitting along different routes allows us to create disconnected views.

By doing the routing on the client, the users computer will need to run more code.

Creating SEO-enabled sites may be more difficult. If SEO becomes more important, we may need to change approaches.
