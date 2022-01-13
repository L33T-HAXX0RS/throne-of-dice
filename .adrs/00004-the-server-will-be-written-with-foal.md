# The Server Will Be Written With Foal

- Status: Accepted

## Context

A web server must be built to manage the application logic.

Since we have chosen to use [TypeScript](https://www.typescriptlang.org/), it makes sense to use [Node.js](https://nodejs.org/en/) for the server. [Deno](https://deno.land/) was considered but at this time, it seems too immature and the author is not familiar enough with it to get the development speed that they want.

Node.js has an enormous number of different server frameworks.

### NestJS

[NestJS](https://nestjs.com/) was considered. It has an easy to use system for constructing controllers and a robust dependency injection system. However, it is crippled by copying the mistakes made by [Angular](https://nestjs.com/). It feels very heavy, very opinionated, and restricts the user from creating their own patterns of development.

### Express

[Express](https://expressjs.com/) is the de-facto Node.js web framework. It is incredibly flexible but that flexibility comes at a cost. The user is responsible for setting up all of the pieces necessary for routing, handling static files, parsing requests, etc. It is incredibly low-level which leads to a slow development pace. It also is not very TypeScript friendly out of the box which can lead to some headaches.

### Foal

[Foal](https://foalts.org/) is an up-and-coming Node.JS framework which takes on a TypeScript first mentality. Unlike NestJS, it is flexible enough to allow the user to develop their own patterns and unlike Express, it is high level enough to avoid building everything from the ground up. The main benefits hear are an easy to use controller system, robust dependency injection, and great support for request parsing.

## Decision

We will use Foal for the web server.

## Consequences

Using Foal gives us speed when developing the server.

Being TypeScript first, it fits in well with the TypeScript monorepo.

It is a relatively immature framework which may lead to headaches later such as bugs or lack of community support.
