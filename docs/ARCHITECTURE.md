# GenReport Architecture

## Core Flow

GenReport is designed around the following flow:

```text
AI Prompt -> Schema -> Runtime -> Integration -> Export
```

Each stage has a clear responsibility:

- **AI Prompt** expresses reporting intent in natural language.
- **Schema** defines that intent as a structured GenReport Definition.
- **Runtime** executes the definition and produces normalized results.
- **Integration** connects the runtime to a framework or application.
- **Export** formats runtime output for delivery.

## GenReport Definition as the Source of Truth

The GenReport Definition is the contract that describes what a report is. It should contain the report structure, data source description, filters, columns, grouping, sorting, summary rules, and export targets.

This definition is the source of truth for execution. Framework code should consume it, not replace it.

## Runtime vs Integration

The runtime is responsible for understanding and executing a GenReport Definition. A framework integration is responsible for adapting that runtime to a specific application environment.

Runtime responsibilities include:

- loading the definition
- validating the definition
- preparing execution behavior
- producing normalized output

Integration responsibilities include:

- connecting framework configuration
- passing request context or parameters
- handling dependency registration
- exposing report execution inside the host framework

An integration is not the runtime itself. It should remain a thin bridge into the runtime layer.

## Runtime vs Exporter

The runtime determines how a report is executed. The exporter determines how the output is delivered.

Runtime responsibilities:

- understand schema rules
- execute report logic
- normalize result sets

Exporter responsibilities:

- render HTML
- produce CSV files
- generate Excel output
- generate PDF output

Exporters must not own business logic or schema interpretation beyond what is necessary to format output.

## Why Framework Code Generation Is Not the Main Foundation

GenReport is intentionally not built around framework code generation as its core model.

Using generated framework code as the primary foundation would create drift between generated files and the schema, increase maintenance cost, and weaken portability across ecosystems. A runtime-first model keeps execution behavior centralized and consistent while still allowing optional code generation later for convenience.

## Future AI Schema Generator

A future AI Schema Generator will transform prompts into valid GenReport Definitions. The generator should target the schema contract directly so that generated output can be validated before execution and reused across runtimes.

## Future Package Distribution Model

The long-term package model is expected to include:

- `@genreport/runtime` for TypeScript
- `genreport/runtime` for PHP
- `genreport/laravel` for Laravel
- `genreport-runtime` for Python
- JVM package coordinates for Maven and Gradle
- NuGet packages for .NET
- Go modules for Go integrations

This repository is the public foundation for that future distribution model, not the completed package set itself.

