# GenReport

Created by LOXAR

**AI-Native Schema-First Reporting Engine**

[![Build](https://img.shields.io/badge/build-placeholder-lightgrey)](#)
[![License](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)
[![Version](https://img.shields.io/badge/version-0.1--draft-orange)](#)
[![Status](https://img.shields.io/badge/status-experimental-red)](#)

GenReport is an AI-native, schema-first, runtime-based reporting engine designed to turn structured report definitions into portable reporting workflows across frameworks, languages, and export targets.

The long-term goal is simple: an AI prompt can produce a GenReport definition, and that definition can be executed by a runtime, connected to an application through an integration layer, and delivered through one or more exporters.

## What Is GRD

GRD stands for GenReport Definition. It is the standard report definition format used by GenReport and typically stored as `.grd.yaml` or `.grd.json`.

A GRD file defines:

- report metadata
- datasource information
- filters
- columns
- sorting
- grouping
- summary rules
- export targets

See [docs/GRD_GUIDE.md](./docs/GRD_GUIDE.md) and [docs/SPECIFICATION.md](./docs/SPECIFICATION.md) for the Phase 1 standard details.

## What GenReport Is

GenReport is a public open-source monorepo for a reporting standard and runtime ecosystem. It is intended to provide:

- A portable report definition format
- Runtime engines for multiple languages
- Framework integrations that connect runtimes into applications
- Exporters that transform runtime output into delivery formats
- A future AI schema generator that turns prompts into report definitions

## Why Schema-First

A schema-first foundation keeps the report definition as the source of truth. Instead of burying reporting logic inside framework-specific code, GenReport describes reports in a consistent JSON or YAML format that can be validated, versioned, reviewed, and transported between systems.

Benefits of the schema-first approach include:

- Clear separation between definition and execution
- Cross-language portability
- Easier AI generation and validation
- Better long-term compatibility for tooling and integrations

## Why Runtime-First Instead of Code-Generation-First

GenReport is intentionally runtime-first. The engine should execute report definitions directly at runtime rather than depending on generated framework code as the main foundation.

This matters because a runtime-first architecture:

- Keeps behavior centralized and consistent
- Reduces regeneration and drift problems
- Makes schema evolution easier to manage
- Supports multiple frameworks without rebuilding the core model every time
- Fits naturally with AI-generated definitions

Code generation may exist in the future for convenience, but it is not the primary foundation of this project.

## Core Architecture Flow

```text
AI Prompt
  -> GenReport Schema Generator
  -> GenReport Definition JSON/YAML
  -> Runtime Engine
  -> Framework Integration
  -> Preview / Export
```

## Example GRD

```yaml
version: "0.1"

report:
  id: sales-summary
  name: Sales Summary Report
  description: Monthly sales summary grouped by branch.

datasource:
  type: table
  table: sales

filters:
  - name: start_date
    type: date
    required: true
  - name: end_date
    type: date
    required: true
  - name: branch_id
    type: string
    required: false

columns:
  - name: invoice_no
    label: Invoice No
    type: string
  - name: invoice_date
    label: Invoice Date
    type: date
  - name: customer_name
    label: Customer
    type: string
  - name: total_amount
    label: Total Amount
    type: number

grouping:
  - branch_id

summary:
  - field: total_amount
    function: sum
    label: Total Sales

sorting:
  - field: invoice_date
    direction: asc

exports:
  - html
  - csv
  - excel
  - pdf
```

Additional examples are available in [`examples/`](./examples), including valid and intentionally invalid GRD files.

## Folder Structure

```text
genreport/
├── schema/
│   └── genreport.schema.json
├── runtimes/
│   ├── typescript/
│   ├── php/
│   ├── python/
│   ├── jvm/
│   ├── dotnet/
│   └── go/
├── integrations/
│   ├── laravel/
│   ├── codeigniter/
│   ├── express/
│   ├── django/
│   └── springboot/
├── exporters/
│   ├── html/
│   ├── csv/
│   ├── excel/
│   └── pdf/
├── examples/
├── docs/
├── .github/
│   ├── workflows/
│   └── ISSUE_TEMPLATE/
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── SECURITY.md
├── CODE_OF_CONDUCT.md
├── ROADMAP.md
├── CHANGELOG.md
└── .gitignore
```

## Supported Runtimes (Planned)

The GenReport runtime model is planned for:

- TypeScript
- PHP
- Python
- JVM
- .NET
- Go

These are planned runtime targets only. Phase 1 does not implement runtime behavior yet.

## Planned Package Ecosystem

Planned package directions for the ecosystem:

- `npm install @genreport/runtime`
- `composer require genreport/runtime`
- `composer require genreport/laravel`
- `pip install genreport-runtime`
- Maven and Gradle package coordinates in a future phase
- NuGet package distribution in a future phase
- Go module distribution in a future phase
- Integration packages such as `@genreport/express`, `genreport/codeigniter`, `genreport-django`, and `io.genreport:genreport-springboot`

## Roadmap

- Phase 0: Repository foundation
- Phase 1: GenReport Schema Standard
- Phase 2: TypeScript Runtime
- Phase 3: PHP Runtime
- Phase 4: Laravel Package
- Phase 5: CodeIgniter Integration
- Phase 6: Python Runtime
- Phase 7: JVM Runtime
- Phase 8: .NET / Go Runtime
- Phase 9: AI Prompt to GenReport Definition Generator

See [ROADMAP.md](./ROADMAP.md) for the longer view.

## Open Source Note

This repository is prepared as a public open-source foundation. It uses only generic examples and intentionally excludes secrets, credentials, private URLs, customer data, hotel data, and personal data.

## Current Status

GenReport is currently in its early foundation stage and should be considered experimental. The repository defines the structure, draft specification, and initial schema contract for the ecosystem, but it does not yet implement full runtimes or production-ready integrations.
