# Use Node script to manage ADRs

- Status: Accepted

## Context

Creating a new record requires copying [`template.md`](./template.md) then modifying it to have the correct title.  Superseding a record requires doing this process as well as going to the file that is superseded and manually updating it.

Any process for automating this needs to be readily available on all developers machines and require zero configuration.

This project is built with [Node.js](https://nodejs.org/en/). That means all developers have immediate access to it. Using Node.js directly means that the script will be written in JavaScript. For this project, we prefer languages with strict type checking. TypeScript was considered as an alternative but it is not a given that all developers have `ts-node` or [Deno](https://deno.land/) installed. Given the restricted scope of the script, this seems to be an acceptable tradeoff.

## Decision

We will use a Node.js script to automate the creation of new records and superseding old ones.

This script will live in `/scripts` and be accessible from the root of the project via `yarn adr`.

New records can be created by typing `yarn adr [title of new record]`. Old records can be superseded by adding a flag to the script. `yarn adr -s [id of old record] [title of new record]`

## Consequences

The tool is readily available to all developers. If the script needs to grow, the lack of type safety may become an issue.
