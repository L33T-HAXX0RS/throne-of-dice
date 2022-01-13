# Throne of Dice

A dice battle game.

## Prerequisites

1. Install [Node.js](https://nodejs.org/)
2. Install [Yarn](https://yarnpkg.com/)
3. Install [Docker](https://www.docker.com/)
4. Install [`path-exists`](https://www.npmjs.com/package/path-exists-cli)
    ```sh
    yarn global add path-exists-cli
    ```
5. Install [VS Code](https://code.visualstudio.com/)

## Getting Started

1. Install all dependencies from the root of the project

```sh
yarn install
```

2. Install the Husky hooks

```sh
npx husky install
```

3. Copy `.env.example` and modify any values as necessary
   ```sh
   cp .env.example .env
   ```

4. Start the database.
   ```sh
   docker compose up -d
   ```
5. Open `app.code-workspace` with VS Code.
6. Press `F5` or go to the `Run and Debug` section and launch `Debug (workspace)`.
7. This will launch the server and the client. The debugger automatically pauses when the server starts. Click the `Continue` button to continue launching the app.

## Technologies

- [TypeScript](https://www.typescriptlang.org/)
- [Foal](https://foalts.org/)
- [TypeORM](https://typeorm.io/)
- [Create React App](https://create-react-app.dev/)
- [Docker](https://www.docker.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redux](https://redux.js.org/)
- [Redux Saga](https://redux-saga.js.org/)
- [Jest](https://jestjs.io/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Yarn](https://yarnpkg.com/)
- [Husky](https://typicode.github.io/husky/)

## Philosophy

The first thing you'll notice is that this project is built as a monorepo. By managing all of the pieces of the system in a single place, this aids in velocity as the entire system can be modified at the same time.

The different packages are separated using ideas outlined in [_Righting Software_](https://rightingsoftware.org/). This document will go in to a high-level explanation of each of the layers. See [_Use Volatility-Based Decomposition_](./.adrs/00005-use-volatility-based-decomposition.md) for a more in-depth explanation.

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

For more information about each of the decisions made for this project, go check out the [ADRs](./.adrs) folder.

## Workspaces

To make it easier to work on a particular part of the application at a time, custom workspaces have been assembled. Open the workspace that makes the most sense for you or just load the entire project in to VS Code at once if you'd prefer.

## Creating New Packages

To make it easier to create your own packages for each layer, there is a `new` script. The script takes in a package type (as defined by layer) and a name. It will take care of putting together the necessary boilerplate for you.

```
Usage: yarn new [type] [name]
```

### Example

```sh
$ yarn new engine validation
```
