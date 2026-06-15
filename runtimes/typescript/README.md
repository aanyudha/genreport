# TypeScript Runtime

The TypeScript runtime is the first active runtime foundation for GenReport.

## Current Capability

Phase 2.1 currently supports:

- loading `.grd.yaml`, `.grd.yml`, and `.grd.json` files
- parsing YAML and JSON GRD content
- validating parsed GRD content against the root GenReport JSON Schema
- running validation from a small CLI command
- test coverage for valid, invalid, malformed, and unsupported inputs

Report execution, datasource access, and export rendering are not implemented yet.

## Package Name

`@genreport/runtime`

## Install Placeholder

```bash
npm install @genreport/runtime
```

For local development in this repository:

```bash
cd runtimes/typescript
npm install
```

## Development Usage

Run the test suite:

```bash
npm test
```

Validate a GRD file from the runtime package:

```bash
npm run validate -- ../../examples/sales-summary.grd.yaml
```

The CLI exits with code `0` for valid input and `1` for invalid input or load/parse failures.

## Current Limitations

- No report execution runtime yet
- No datasource or database connection support yet
- No HTML, CSV, Excel, or PDF rendering yet
- Schema validation is currently based on the repository root schema file
