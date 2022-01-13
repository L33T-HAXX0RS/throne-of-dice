# Build Project As A TypeScript Monorepo

- Status: Accepted

## Context

A general approach for architecting the application must be set out. The choice of architecture and language(s) must be made.

The goal of this project is to be quick to build, easy to debug, and have strong type guarantees. The author of this project is very comfortable with [TypeScript](https://www.typescriptlang.org/), finds it makes a good balance between speed and accuracy, and has well-developed tooling around it.

## Decision

The project will be written in TypeScript.

The application will be built as a monorepo.

## Consequences

By using TypeScript, we get strong typing and the ability to use the same language for the backend and frontend.

We can leverage the great tooling made for TypeScript, particularly by using [VS Code](https://code.visualstudio.com/).

A monorepo makes it easy to iterate on the entire project at once and does not require independent versioning of elements of the application. It also allows us to share types between the different elements of the application to further strengthen our type guarantees.

A monorepo may make it difficult to develop if the application expands far enough. Coordinating work across multiple teams on the same repository is very difficult. Build times may suffer if the system becomes large enough.
