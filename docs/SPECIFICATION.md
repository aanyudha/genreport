# GenReport Definition Standard v0.1

This document defines the GenReport Definition standard for version `0.1`. A GenReport Definition may be written in JSON or YAML and is commonly referred to as a GRD file.

The GRD is the portable source of truth for a report. It describes what a report is, how it should read data, how inputs should be validated, how results should be shaped, and which export targets are intended.

## Top-Level Structure

The following top-level fields are defined in standard v0.1:

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
- Required: yes
- Current value for this standard: `"0.1"`

## Report Metadata

The `report` object describes identity and human-readable metadata for the report definition.

Supported fields:

- `id`: stable machine-friendly identifier
- `name`: human-readable name
- `description`: optional explanation of the report purpose

Rules:

- `report.id` should be stable across revisions of the same logical report
- `report.name` should be readable by end users or maintainers
- `report.description` should stay concise and public-safe

Example:

```yaml
report:
  id: member-expiry
  name: Member Expiry Report
  description: Lists memberships approaching their expiration date.
```

## Datasource Definition

The `datasource` object describes the logical source of data for a report.

Supported fields in v0.1:

- `type`: datasource category
- `table`: logical table or dataset name

Supported datasource types in v0.1:

- `table`

Rules:

- `datasource` is required
- `datasource.type` must use a supported enum value
- `datasource.table` must be a non-empty string

Example:

```yaml
datasource:
  type: table
  table: memberships
```

## Filter Definition

The `filters` array defines input parameters that may constrain report execution.

Each filter object supports:

- `name`: filter identifier
- `type`: filter data type
- `required`: whether the caller must provide a value

Supported filter types in v0.1:

- `string`
- `number`
- `integer`
- `boolean`
- `date`
- `datetime`

Rules:

- Filter names should be descriptive and machine-friendly
- Each filter entry should describe input shape, not query logic
- Filters should remain portable across runtimes

Example:

```yaml
filters:
  - name: start_date
    type: date
    required: true
  - name: branch_id
    type: string
    required: false
```

## Column Definition

The `columns` array defines the fields that appear in the report result set.

Each column object supports:

- `name`: source or logical field name
- `label`: human-readable display label
- `type`: column data type

Supported column types in v0.1:

- `string`
- `number`
- `integer`
- `boolean`
- `date`
- `datetime`

Rules:

- `columns` is required and must contain at least one entry
- Column order is significant and should reflect intended output order
- `label` should be presentation-friendly, while `name` remains machine-friendly

Example:

```yaml
columns:
  - name: member_name
    label: Member Name
    type: string
  - name: expiry_date
    label: Expiry Date
    type: date
```

## Sorting Definition

The `sorting` array defines output ordering.

Each sorting object supports:

- `field`: field name to sort by
- `direction`: sort direction

Supported directions in v0.1:

- `asc`
- `desc`

Rules:

- Sorting fields should refer to defined output or logical source fields
- Ordering should remain deterministic where possible

Example:

```yaml
sorting:
  - field: expiry_date
    direction: asc
```

## Grouping Definition

The `grouping` array defines one or more field names used to group report results.

Representation in v0.1:

- Array of strings

Rules:

- Grouping values should reference valid logical fields
- Grouping should be used only when the report intends sectioned or aggregate output

Example:

```yaml
grouping:
  - branch_id
```

## Summary Definition

The `summary` array defines aggregate calculations for the report result set.

Each summary object supports:

- `field`: field to aggregate
- `function`: aggregation function
- `label`: optional display label

Supported summary functions in v0.1:

- `sum`
- `avg`
- `min`
- `max`
- `count`

Rules:

- Summary functions should be deterministic across runtimes
- Numeric functions such as `sum` and `avg` should be used with numeric fields
- `label` should clearly describe the aggregate result

Example:

```yaml
summary:
  - field: total_amount
    function: sum
    label: Total Sales
```

## Export Definition

The `exports` array defines allowed or intended output targets for the report.

Supported export types in v0.1:

- `html`
- `csv`
- `excel`
- `pdf`

Rules:

- Export values must come from the supported enum set
- Export targets describe delivery intent, not business logic

Example:

```yaml
exports:
  - html
  - csv
  - pdf
```

## Validation Rules

The following validation rules apply to GRD v0.1:

- The root object must include `version`, `report`, `datasource`, and `columns`
- Additional unknown top-level fields are not allowed by the current schema
- `report.id` and `report.name` are required
- `datasource.type` and `datasource.table` are required
- `columns` must contain at least one valid column entry
- `filters`, `sorting`, `grouping`, `summary`, and `exports` are optional
- `sorting.direction` must be `asc` or `desc`
- `summary.function` must be one of the supported aggregate functions
- `exports` values must be supported export types
- `exports` values must be unique

Some semantic checks are intentionally left to future runtimes or validators, such as verifying that a `sorting.field` or `summary.field` references a known field.

## Reserved Keywords

The following top-level keywords are reserved by the standard:

- `version`
- `report`
- `datasource`
- `filters`
- `columns`
- `sorting`
- `grouping`
- `summary`
- `exports`

The following nested field names are also reserved within their respective objects:

- `id`
- `name`
- `description`
- `type`
- `table`
- `label`
- `required`
- `field`
- `direction`
- `function`

Future versions may reserve additional keywords. Tooling should avoid reinterpreting reserved keywords for unrelated meanings.

## Future Compatibility Notes

- v0.1 is intentionally compact and portable
- Future versions may add joins, computed fields, filter operators, formatting metadata, permissions, localization, and richer datasource definitions
- Future versions should prefer additive evolution where practical
- Breaking changes should require a version change and an updated schema contract
- Runtimes should read the declared `version` before attempting execution

## Design Principles

- The definition remains the source of truth
- The standard stays runtime-first rather than code-generator-first
- The structure stays framework-agnostic
- The contract should remain simple enough for deterministic AI generation and validation

