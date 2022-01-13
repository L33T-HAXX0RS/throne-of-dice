# Use SQLite For The Database

- Status: Superseded by [00007-Use PostgreSQL For The Database](./00007-use-postgresql-for-the-database.md)

## Context

The system requires a data store for various data.

At this stage, the priority is ease of development. The quickest and easiest database to get started using is [SQLite](https://www.sqlite.org/index.html). It is a very simple SQL implementation and lacks some more advanced features but is very easy to work with and iterate against.

## Decision

The database will be built with SQLite.

## Consequences

Using SQLite means development will be quick to iterate on.

By having separate database files for each section of the system, we will be able to easily perform integration testing in parallel.

Due to the limitations of SQLite, it is likely we will run in to issues with scaling in the future.
