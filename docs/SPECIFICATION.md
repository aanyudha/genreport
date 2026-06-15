# GenReport Definition Specification v0.1 Draft

This document defines the early draft structure for a GenReport Definition. The format may be expressed as JSON or YAML, but the logical structure is the same.

## Top-Level Structure

The following top-level fields are defined in draft v0.1:

- `version`
- `report`
- `datasource`
- `filters`
- `columns`
- `sorting`
- `grouping`
- `summary`
- `exports`

## `version`

The schema version for the definition.

- Type: string
- Example: `"0.1"`

## `report`

Describes report identity and metadata.

Suggested fields:

- `id`: stable machine-friendly report identifier
- `name`: human-readable report name
- `description`: optional explanation of report purpose

## `datasource`

Describes where the runtime should read data from.

Draft fields:

- `type`: datasource category such as `table`
- `table`: source table or logical dataset name

Future versions may support additional source models, joins, queries, or adapters.

## `filters`

Defines input parameters that can constrain report execution.

Each filter may include:

- `name`
- `type`
- `required`

Possible future additions include labels, defaults, validation constraints, and operators.

## `columns`

Defines the fields that should appear in the result set.

Each column may include:

- `name`
- `label`
- `type`

Future versions may support computed fields, formatting rules, expressions, and visibility controls.

## `sorting`

Defines output ordering.

Each sorting entry may include:

- `field`
- `direction`

Allowed draft directions:

- `asc`
- `desc`

## `grouping`

Defines one or more fields used to group report results.

Draft v0.1 represents grouping as an array of field names.

## `summary`

Defines aggregate calculations over the result set.

Each summary entry may include:

- `field`
- `function`
- `label`

Draft summary functions may include:

- `sum`
- `avg`
- `min`
- `max`
- `count`

## `exports`

Defines allowed or intended output targets for the report.

Draft export values may include:

- `html`
- `csv`
- `excel`
- `pdf`

## Design Notes

- The definition should remain portable across languages.
- The schema should be simple enough for AI generation and deterministic validation.
- Runtime behavior should be derived from the definition rather than framework-specific code.

