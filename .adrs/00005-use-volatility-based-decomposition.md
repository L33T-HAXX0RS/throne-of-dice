# Use Volatility-Based Decomposition

- Status: Accepted

## Context

When building software, it's necessary to setup an architecture to determine where pieces of functionality will live. 

The book [_Righting Software_](https://rightingsoftware.org/) outlines some methods for creating a scalable architecture that responds well to change. To summarize, a system is broken in to a series of services: clients, managers, engines, resources, and utilities. Each of these pieces should encapsulate a given volatility of the system.

To answer where a piece of functionality lives, you can ask yourself "who", "what", "how", and "where".

Clients answer the question of "who" is interacting with the system. This could be a web client, a server making requests on behalf of a users, or any other user-facing system.

Managers tell us "what" is required of the system. They give are the workflows which define the actual functionality of a system. Clients call in to managers to perform functionality.

Engines tell us "how" to perform business logic. Managers may also answer this question but, in general, if you need to perform a chunk of business logic in more than one manager, you want an engine.

Resources are "where" the system state is. This could be a database, a PubSub stream, a network resource, etc. Any data resource is captured here. As a result, the layer containing resources is called the "access" layer.

Finally, utilities are the ubiquitous pieces. Things that are needed by multiple different layers. For example, logging is necessary for clients, managers, engines, and resources.

When following this form of decomposition, we get some rules of engagement. You can think of each of these services existing in a layer and layers may only reach in to layers directly below them. There is a little bit of nuance to be aware of. Managers and engines live in the business logic layer. While living in the same layer, engines are beneath managers. This means that managers can use both engines and the resource or access layer.

```
┌────────┐            ┌─────────┐
│        │            │         │
│ Client ├────────────►         │
│        │            │         │
└────┬───┘            │         │
     │                │         │
┌────▼────┐           │         │
│         │           │         │
│ Manager │           │         │
│         ├───────────►         │
└──┬─────┬┘           │         │
   │     │            │         │
   │     │            │         │
   │  ┌──▼─────┐      │         │
   │  │        │      │ Utility │
   │  │ Engine ├──────►         │
   │  │        │      │         │
   │  └─────┬──┘      │         │
   │        │         │         │
   │        │         │         │
┌──▼─────┐  │         │         │
│        ◄──┘         │         │
│ Access │            │         │
│        ├────────────►         │
└────────┘            └─────────┘
```

## Decision

We will utilize volatility-based decomposition.

Clients will live in the `app` folder.

Managers will live in the `manager` folder.

Engines will live in the `engine` folder.

Resource access services will live in the `access` folder.

Utility level services will live in the `utility` folder.

All packages shall be scoped with using these folder names. For example, if you have a "validation engine" then it will live in `engine/validation` with the package name `@engine/validation`.

## Consequences

By following a volatility-based decomposition, the system should be able to absorb change more easily.

Following the layered approach should make it easier to determine how to decompose a system and where those pieces should fit.

By requiring this sort of approach, it requires thinking about the architecture up front which may feel like it's slowing down development. The idea is that by thinking of the system in advance, we give ourselves more velocity over the rest of the project.
