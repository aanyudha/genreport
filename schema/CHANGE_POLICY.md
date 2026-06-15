# GRD Change Policy

## Purpose

This document explains how the GenReport Definition standard evolves over time.

## Versioning Principles

- Every GRD file must declare its `version`
- Schema changes must be documented in the specification and reflected in the JSON Schema
- Runtime implementations should read the declared version before execution

## Preferred Evolution Style

GenReport should prefer additive change where practical. Examples include:

- adding a new optional field
- adding a new supported enum value
- clarifying behavior without changing structure

## Breaking Changes

A breaking change includes:

- removing an existing field
- changing the meaning of an existing field
- tightening validation in a way that invalidates previously valid definitions
- changing default interpretation in a way that affects execution behavior

Breaking changes should require a new standard version and coordinated updates to:

- `docs/SPECIFICATION.md`
- `schema/genreport.schema.json`
- example GRD files where relevant

## Proposal Process

Recommended process for GRD changes:

1. Open a schema proposal issue
2. Describe the use case and the limitation in the current standard
3. Explain validation and runtime implications
4. Update the specification and schema together
5. Add or revise examples that demonstrate the change

## Compatibility Guidance

- Runtimes should fail clearly on unsupported versions
- Tooling should avoid guessing the meaning of unknown fields
- Future standard versions should preserve portability as a core goal

