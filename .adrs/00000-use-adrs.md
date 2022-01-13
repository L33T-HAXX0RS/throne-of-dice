# Use ADRs

- Status: Accepted

## Context

Decisions about codebases are generally only transmitted by word of mouth. This leads to misunderstanding of what decisions were made, why they were made, and slows down productivity.

We would like to be able to capture decisions made about our codebase in an easy to write and easy to read format.

## Decision

We will utilize [ADRs (or architecture decision records)](https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions) to document decisions made for our codebase.

We will use these records for documenting [any big changes, common problems, or stylistic choices](https://engineering.atspotify.com/2020/04/14/when-should-i-write-an-architecture-decision-record/).

These documents will live in `/.adrs` and will be numbered sequentially. The format for these decisions is given in [`template.md`](template.md)

## Consequences

We will have a series of documents outlining various decisions made about the codebase. This will lead to faster ramp up time, a location for determining what decisions were made and why, and increase confidence in the codebase.

There will be some mental load to remember to add documents when decisions are made.
