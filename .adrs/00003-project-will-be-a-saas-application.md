# Project Will Be A SaaS Application

- Status: Accepted

## Context

A general design for application delivery must be chosen.

There are a number of ways to deliver an application to a user:

### Executable

The classic example is a simple executable which is installed and run on the clients machine. This is a good design if the application must run extremely fast or be guaranteed to work in an offline environment. However, it is much more difficult to roll out updates to an installed application. It also requires the user to actually install the software to use it.

### SaaS

An application which runs on a server and is presented to the user via a browser or similar client. By following this architecture, you get the benefit of near-instant software updates, no installation necessary, and the logic of the application can't be cloned. The downside is that you trade some potential operating power and the application requires an internet connection, excluding some minimal functionality.

## Decision

The project will be a SaaS application.

A web server will be built and an accompanying web client will be built.

## Consequences

We are trading speed and offline capabilities for fast updates and better control over the application.

In order to enable minimal offline capabilities, additional work must be done to detect the user is offline and still provide a workable application.
