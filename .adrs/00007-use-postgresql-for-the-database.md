# Use PostgreSQL For The Database

- Status: Accepted

## Context

SQLite lacks more advanced features and scaling ability that we would like to have for a production level database.

There are a number of different database systems. The one that we are most familiar with is [PostgreSQL](https://www.postgresql.org/). Furthermore, PostgreSQL is something of an industry standard. It is a mature technology with a lot of support.

## Decision

We will use PostgreSQL for the database engine.

[Docker](https://www.docker.com/) will be used to host the PostgreSQL instance.

## Consequences

Previous SQLite code must be rewritten in Postgres compatible syntax.
